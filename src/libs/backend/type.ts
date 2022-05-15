import { fs } from '@tauri-apps/api'

export interface IFsOutput extends fs.FileEntry {
  create_time?: number | string
}
