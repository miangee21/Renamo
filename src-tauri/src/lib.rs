mod commands {
    pub mod list_files;
    pub mod rename_files;
    pub mod undo_rename;
}

use commands::list_files::list_files;
use commands::rename_files::rename_files;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            list_files,
            rename_files,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}