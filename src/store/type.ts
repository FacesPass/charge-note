import { IFsOutput } from '@/libs/backend/type'

export interface IDefaultState {
  appName: string
  appVersion: string
  editorMode: 'view' | 'edit'
  fileList: IFsOutput[]
  workspaceRoot: string | undefined
  workspacePath: string | undefined
}

export interface IModalState {
  isShowAboutModal: boolean
  isShowMaximizedModal: boolean
}

export interface IEditorState {
  isChanged: boolean
}
