import { fs } from '@tauri-apps/api'

export default interface IDEFAULT_STATE {
  editorMode: 'view' | 'edit'
  fileList: fs.FileEntry[]
  workspaceRoot: string | undefined
  workspacePath: string | undefined
}
