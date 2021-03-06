import Storage from '.'

export enum ModalStorageState {
  DISABLED_MAXIMIZE = 'disabledMaximizeModal',
  DISABELD_REMOVE_CONFIRM = 'disabledRemoveConfirmModal',
}

class ModalStorage extends Storage<ModalStorageState> {
  constructor() {
    super()
  }

  getState<T extends ModalStorageState>(key: T) {
    return this.get(key)
  }

  setState<T extends ModalStorageState>(key: T, value: unknown) {
    this.set(key, value)
  }
}

export const modalStorage = new ModalStorage()
