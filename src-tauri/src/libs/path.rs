// 编写供前端调用的 API
use serde::Serialize;
use std::{
    fs::{self, metadata},
    path::{Path, PathBuf},
    time::SystemTime,
};
use tauri::api::Result;

#[derive(Debug, Serialize)]
pub struct DirOuput {
    path: PathBuf,
    name: Option<String>,
    create_time: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    children: Option<Vec<DirOuput>>,
}

pub fn is_dir<P: AsRef<Path>>(path: P) -> Result<bool> {
    metadata(path)
        .map(|metadata| metadata.is_dir())
        .map_err(Into::into)
}

/// tauri 原生提供的读取文件 api 没返回文件修改时间， 重写该方法
pub fn read_dir<P: AsRef<Path>>(path: P, recursive: bool) -> Result<Vec<DirOuput>> {
    let mut files_and_dirs: Vec<DirOuput> = vec![];
    for entry in fs::read_dir(path)? {
        let path = entry?.path();
        let path_as_string = path.display().to_string();

        if let Ok(flag) = is_dir(&path_as_string) {
            files_and_dirs.push(DirOuput {
                path: path.clone(),
                children: if flag {
                    Some(if recursive {
                        read_dir(&path_as_string, true)?
                    } else {
                        vec![]
                    })
                } else {
                    None
                },
                create_time: metadata(&path_as_string)
                    .map(|metadata| metadata.modified())
                    .unwrap()
                    .map(|time| {
                        time.duration_since(SystemTime::UNIX_EPOCH)
                            .unwrap()
                            .as_secs()
                    })
                    .ok(),
                name: path
                    .file_name()
                    .map(|name| name.to_string_lossy())
                    .map(|name| name.to_string()),
            });
        }
    }

    Result::Ok(files_and_dirs)
}
