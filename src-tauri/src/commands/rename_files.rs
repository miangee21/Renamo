use serde::{Deserialize, Serialize};
use std::fs;
use std::io::Write;
use std::process::Command;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct RenameFile {
    pub old_name: String,
    pub new_name: String,
    pub path: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct RenameRequest {
    pub folder_path: String,
    pub files: Vec<RenameFile>,
}

#[tauri::command]
pub fn rename_files(request: RenameRequest) -> Result<String, String> {
    if request.files.is_empty() {
        return Err("No files to rename".to_string());
    }

    let folder = &request.folder_path;
    let mut ps_lines: Vec<String> = Vec::new();

    // Phase 1 — temp names
    for (i, file) in request.files.iter().enumerate() {
        let old_path = format!("{}\\{}", folder, file.old_name).replace('\'', "''");
        let temp_name = format!("__renamo_temp_{}__", i);
        ps_lines.push(format!(
            "Rename-Item -LiteralPath '{}' -NewName '{}'",
            old_path, temp_name
        ));
    }

    // Phase 2 — final names
    for (i, file) in request.files.iter().enumerate() {
        let temp_path = format!("{}\\__renamo_temp_{}__", folder, i).replace('\'', "''");
        let new_name = file.new_name.replace('\'', "''");
        ps_lines.push(format!(
            "Rename-Item -LiteralPath '{}' -NewName '{}'",
            temp_path, new_name
        ));
    }

    let ps_script = ps_lines.join("\r\n");

    // Temp PS1 file banao
    let temp_dir = std::env::temp_dir();
    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .subsec_nanos();
    let script_path = temp_dir.join(format!("renamo_{}.ps1", timestamp));

    let mut file = fs::File::create(&script_path)
        .map_err(|e| format!("Failed to create script file: {}", e))?;

    file.write_all(ps_script.as_bytes())
        .map_err(|e| format!("Failed to write script: {}", e))?;

    drop(file); // File handle band karo pehle

    // PS1 file run karo — Windows ya Linux
    #[cfg(target_os = "windows")]
    use std::os::windows::process::CommandExt;
    const CREATE_NO_WINDOW: u32 = 0x08000000;

    let output = Command::new("powershell")
        .args([
            "-NoProfile",
            "-NonInteractive",
            "-ExecutionPolicy",
            "Bypass",
            "-File",
            script_path.to_str().unwrap(),
        ])
        .creation_flags(CREATE_NO_WINDOW)
        .output()
        .map_err(|e| format!("Failed to run PowerShell: {}", e))?;

    #[cfg(not(target_os = "windows"))]
    let output = {
        // Linux/Mac pe Rust native rename
        let mut success_count = 0;
        for file in &request.files {
            let old = std::path::Path::new(&folder).join(&file.old_name);
            let new = std::path::Path::new(&folder).join(&file.new_name);
            if std::fs::rename(&old, &new).is_ok() {
                success_count += 1;
            }
        }
        // Cleanup script
        let _ = std::fs::remove_file(&script_path);
        return Ok(format!("{} files renamed successfully", success_count));
    };

    // Cleanup
    let _ = fs::remove_file(&script_path);

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("PowerShell error: {}", stderr));
    }

    Ok(format!(
        "{} files renamed successfully",
        request.files.len()
    ))
}
