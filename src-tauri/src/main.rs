#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod frontend;
use frontend::read_dir;
mod libs;
use libs::project::{
    create_menu, create_system_tray_menu, handle_menu_event, handle_system_tray_event,
};

fn main() {
    tauri::Builder::default()
        .system_tray(create_system_tray_menu())
        .on_system_tray_event(handle_system_tray_event())
        .menu(create_menu())
        .on_menu_event(handle_menu_event())
        .invoke_handler(tauri::generate_handler![read_dir])
        .run(tauri::generate_context!())
        .expect("启动应用出错");
}
