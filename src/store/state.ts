import { IDefaultState, IModalState } from './type'

export const DEFAULT_STATE: IDefaultState = {
  appName: '',
  appVersion: '',
  editorMode: 'view',
  /* 面包屑导航栏路径列表 */
  fileList: [],
  /* 工作空间根路径 */
  workspaceRoot: undefined,
  /* 工作空间完整路径 */
  workspacePath: undefined,
}

export const MODAL_STATE: IModalState = {
  /* 显示关于的弹窗 */
  isShowAboutModal: false,
  /* 显示最大化窗口的弹窗 */
  isShowMaximizedModal: false,
}
