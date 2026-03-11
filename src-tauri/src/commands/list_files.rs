use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct FileEntry {
    pub name: String,
    pub path: String,
    pub extension: String,
    pub modified: u64,
    pub file_type: String,
}

const IMAGE_EXTS: &[&str] = &[
    "jpg", "jpeg", "png", "gif", "bmp", "webp", "tiff", "tif", "heic", "heif", "avif", "raw",
    "cr2", "nef", "arw", "svg",
];

const VIDEO_EXTS: &[&str] = &[
    "mp4", "mkv", "avi", "mov", "wmv", "flv", "webm", "m4v", "3gp", "ts", "mts", "m2ts", "vob",
    "ogv", "rm", "rmvb",
];

fn natural_sort(a: &str, b: &str) -> std::cmp::Ordering {
    let a_lower = a.to_lowercase();
    let b_lower = b.to_lowercase();
    let mut a_chars = a_lower.as_str();
    let mut b_chars = b_lower.as_str();

    loop {
        match (a_chars.is_empty(), b_chars.is_empty()) {
            (true, true) => return std::cmp::Ordering::Equal,
            (true, false) => return std::cmp::Ordering::Less,
            (false, true) => return std::cmp::Ordering::Greater,
            _ => {}
        }

        let a_is_digit = a_chars.starts_with(|c: char| c.is_ascii_digit());
        let b_is_digit = b_chars.starts_with(|c: char| c.is_ascii_digit());

        if a_is_digit && b_is_digit {
            let a_num_str: String = a_chars.chars().take_while(|c| c.is_ascii_digit()).collect();
            let b_num_str: String = b_chars.chars().take_while(|c| c.is_ascii_digit()).collect();
            let a_num: u64 = a_num_str.parse().unwrap_or(0);
            let b_num: u64 = b_num_str.parse().unwrap_or(0);

            match a_num.cmp(&b_num) {
                std::cmp::Ordering::Equal => {
                    a_chars = &a_chars[a_num_str.len()..];
                    b_chars = &b_chars[b_num_str.len()..];
                }
                other => return other,
            }
        } else {
            let a_ch = a_chars.chars().next().unwrap();
            let b_ch = b_chars.chars().next().unwrap();

            match a_ch.cmp(&b_ch) {
                std::cmp::Ordering::Equal => {
                    a_chars = &a_chars[a_ch.len_utf8()..];
                    b_chars = &b_chars[b_ch.len_utf8()..];
                }
                other => return other,
            }
        }
    }
}

#[tauri::command]
pub fn list_files(folder_path: String) -> Result<Vec<FileEntry>, String> {
    let path = Path::new(&folder_path);

    if !path.exists() || !path.is_dir() {
        return Err("Invalid folder path".to_string());
    }

    let mut files: Vec<FileEntry> = Vec::new();
    let entries = fs::read_dir(path).map_err(|e| e.to_string())?;

    for entry in entries.flatten() {
        let file_path = entry.path();

        if file_path.is_dir() {
            continue;
        }

        let name = file_path
            .file_name()
            .and_then(|n| n.to_str())
            .unwrap_or("")
            .to_string();

        let extension = file_path
            .extension()
            .and_then(|e| e.to_str())
            .unwrap_or("")
            .to_lowercase();

        let modified = entry
            .metadata()
            .ok()
            .and_then(|m| m.modified().ok())
            .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
            .map(|d| d.as_secs())
            .unwrap_or(0);

        let file_type = if IMAGE_EXTS.contains(&extension.as_str()) {
            "image".to_string()
        } else if VIDEO_EXTS.contains(&extension.as_str()) {
            "video".to_string()
        } else {
            "other".to_string()
        };

        files.push(FileEntry {
            name,
            path: file_path.to_string_lossy().to_string(),
            extension,
            modified,
            file_type,
        });
    }

    files.sort_by(|a, b| natural_sort(&a.name, &b.name));

    Ok(files)
}
