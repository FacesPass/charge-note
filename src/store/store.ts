import { makeAutoObservable } from 'mobx'
import { DEFAULT_STATE, MODAL_STATE } from './state'
import { set, get } from 'jsonuri'
import { filterMarkdownFile } from '@/libs/utils/file'
import type { IDefaultState, IModalState } from './type'
import { readDir } from '@/libs/backend'

type TStateKeys = keyof IDefaultState
type TModalStateKeys = keyof IModalState

class GlobalStore {
  constructor() {
    makeAutoObservable(this)
  }

  private state = DEFAULT_STATE
  private modalState = MODAL_STATE

  /* 获取全局数据 */
  getState<T extends TStateKeys>(path: T): IDefaultState[T] {
    return get(this.state, path)
  }

  /* 修改全局数据 */
  setState<T extends TStateKeys>(key: T, val: IDefaultState[T]) {
    set(this.state, key, val)
  }

  getModalState<T extends TModalStateKeys>(path: T): typeof MODAL_STATE[T] {
    return get(this.modalState, path)
  }

  setModalState<T extends TModalStateKeys>(key: T, val: IModalState[T]) {
    this.closeAllModals()
    set(this.modalState, key, val)
  }

  closeAllModals() {
    ;(Object.keys(this.modalState) as TModalStateKeys[]).forEach((key) => {
      this.modalState[key] = false
    })
  }

  async updateFileList(dirPath: string) {
    const fileList = await readDir(dirPath)
    this.state.fileList = filterMarkdownFile(fileList)
  }
}

export default GlobalStore
