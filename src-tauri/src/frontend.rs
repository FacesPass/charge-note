use crate::libs::path;

#[tauri::command]
pub fn read_dir(path: String, recursive: bool) -> Result<Vec<path::DirOuput>, String> {
    match path::read_dir(path, recursive) {
        Ok(output) => Ok(output),
        Err(err) => Err(format!("读取出错, {}", &err)),
    }
}
