import { invoke } from '@tauri-apps/api'
import { IFsOutput } from './type'

/**
 * Rust后端的 API 定义
 */
export function readDir(path: string, recursive = false): Promise<IFsOutput[]> {
  return invoke('read_dir', { path, recursive })
}
