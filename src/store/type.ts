import { IFsOutput } from '@/libs/backend/type'

export default interface IDEFAULT_STATE {
  appName: string
  appVersion: string
  editorMode: 'view' | 'edit'
  fileList: IFsOutput[]
  workspaceRoot: string | undefined
  workspacePath: string | undefined
}
