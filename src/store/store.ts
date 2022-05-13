import { makeAutoObservable } from 'mobx'
import { DEFAULT_STATE } from './state'
import { set, get } from 'jsonuri'
import IDEFAULT_STATE from './type'
import { filterMarkdownFile } from '@/libs/utils/file'
import { readDir } from '@tauri-apps/api/fs'

type TStateKeys = keyof IDEFAULT_STATE

class GlobalStore {
  constructor() {
    makeAutoObservable(this)
  }

  private state = DEFAULT_STATE

  getState<T extends TStateKeys>(path: T): IDEFAULT_STATE[T] {
    return get(this.state, path)
  }

  setState<T extends TStateKeys>(key: T, val: IDEFAULT_STATE[T]) {
    set(this.state, key, val)
  }

  async updateFileList(dirPath: string) {
    const fileList = await readDir(dirPath)
    const markdownFileList = filterMarkdownFile(fileList)
    this.state.fileList = markdownFileList
  }
}

export default GlobalStore
