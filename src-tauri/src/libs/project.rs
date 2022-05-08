use std::process;
use tauri::{
    App, AppHandle, CustomMenuItem, Manager, Menu, SystemTray, SystemTrayEvent, SystemTrayMenu,
    SystemTrayMenuItem, Window, WindowMenuEvent,
};

/// 创建自定义菜单
pub fn create_menu() -> Menu {
    let menu = Menu::new();

    menu
}

/// 处理自定义菜单事件
pub fn handle_menu_event() -> impl Fn(WindowMenuEvent) + Send + Sync + 'static {
    move |event: WindowMenuEvent| match event.menu_item_id() {
        _ => {}
    }
}

/// 创建系统托盘菜单
pub fn create_system_tray_menu() -> SystemTray {
    let show = CustomMenuItem::new("show".to_string(), "显示");
    let quit = CustomMenuItem::new("quit".to_string(), "退出");
    let tray_menu = SystemTrayMenu::new()
        .add_item(show)
        .add_item(quit)
        .add_native_item(SystemTrayMenuItem::Separator);

    SystemTray::new().with_menu(tray_menu)
}

/// 处理托盘菜单事件
pub fn handle_system_tray_event() -> impl Fn(&AppHandle, SystemTrayEvent) + Send + Sync + 'static {
    move |app, event| match event {
        SystemTrayEvent::DoubleClick { .. } => {
            let window: Window = app.get_window("main").unwrap();
            if window.is_visible().unwrap() {
                window.hide().unwrap();
            } else {
                window.show().unwrap();
            }
        }
        SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
            "show" => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
            }
            "quit" => {
                std::process::exit(0);
            }
            _ => {}
        },
        _ => {}
    }
}
