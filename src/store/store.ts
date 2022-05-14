import { makeAutoObservable } from 'mobx'
import { DEFAULT_STATE, MODAL_STATE } from './state'
import { set, get } from 'jsonuri'
import { filterMarkdownFile } from '@/libs/utils/file'
import { readDir } from '@tauri-apps/api/fs'
import type IDEFAULT_STATE from './type'

type TStateKeys = keyof IDEFAULT_STATE
type TModalState = typeof MODAL_STATE
type TModalStateKeys = keyof TModalState

class GlobalStore {
  constructor() {
    makeAutoObservable(this)
  }

  private state = DEFAULT_STATE
  private modalState = MODAL_STATE

  /* 获取全局数据 */
  getState<T extends TStateKeys>(path: T): IDEFAULT_STATE[T] {
    return get(this.state, path)
  }

  /* 修改全局数据 */
  setState<T extends TStateKeys>(key: T, val: IDEFAULT_STATE[T]) {
    set(this.state, key, val)
  }

  /* 获取弹窗状态 */
  getModalState<T extends TModalStateKeys>(path: T): typeof MODAL_STATE[T] {
    return get(this.modalState, path)
  }

  /* 设置弹窗状态 */
  setModalState<T extends TModalStateKeys>(key: T, val: TModalState[T]) {
    set(this.modalState, key, val)
  }

  /* 更新文件列表 */
  async updateFileList(dirPath: string) {
    const fileList = await readDir(dirPath)
    this.state.fileList = filterMarkdownFile(fileList)
  }
}

export default GlobalStore
