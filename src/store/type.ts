import { fs } from '@tauri-apps/api'

export default interface IDEFAULT_STATE {
  listShowMode: 'tree' | 'flat'
  editorMode: 'view' | 'edit'
  fileList: fs.FileEntry[]
  workspaceRoot: string | undefined
  workspacePath: string | undefined
}
