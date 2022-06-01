import { makeAutoObservable, runInAction } from 'mobx'
import { DEFAULT_STATE, EDITOR_STATE, MODAL_STATE } from './state'
import { set, get } from 'jsonuri'
import { filterMarkdownFile, orderFileListSequense } from '@/libs/utils/file'
import type { IDefaultState, IEditorState, IModalState } from './type'
import { readDir } from '@/libs/backend'

type TStateKeys = keyof IDefaultState
type TModalStateKeys = keyof IModalState
type TEditorStateKeys = keyof IEditorState

class GlobalStore {
  constructor() {
    makeAutoObservable(this)
  }

  private state = DEFAULT_STATE
  private modalState = MODAL_STATE
  private editorState = EDITOR_STATE

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

  getEditorState<T extends TEditorStateKeys>(path: T): typeof EDITOR_STATE[T] {
    return get(this.editorState, path)
  }

  setEditorState<T extends TEditorStateKeys>(key: T, val: IEditorState[T]) {
    set(this.editorState, key, val)
  }

  closeAllModals() {
    ;(Object.keys(this.modalState) as TModalStateKeys[]).forEach((key) => {
      this.modalState[key] = false
    })
  }

  async updateFileList(dirPath: string) {
    const fileList = await readDir(dirPath)
    runInAction(() => {
      this.state.fileList = orderFileListSequense(filterMarkdownFile(fileList))
    })
  }
}

export default GlobalStore
