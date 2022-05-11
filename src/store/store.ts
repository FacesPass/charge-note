import { makeAutoObservable } from 'mobx'
import { DEFAULT_STATE } from './state'
import { set, get } from 'jsonuri'
import IDEFAULT_STATE from './type'
import { fs } from '@tauri-apps/api'

type TStateKeys = keyof IDEFAULT_STATE

class GlobalStore {
  constructor() {
    makeAutoObservable(this)
  }

  private state = DEFAULT_STATE

  getState<T extends TStateKeys>(path: T): IDEFAULT_STATE[T] {
    return get(this.state, path)
  }

  setState(key: TStateKeys, val: unknown) {
    set(this.state, key, val)
  }

  async updateFileList(dirPath: string) {
    const fileList = await fs.readDir(dirPath)
    this.state.fileList = fileList
  }
}

export default GlobalStore
