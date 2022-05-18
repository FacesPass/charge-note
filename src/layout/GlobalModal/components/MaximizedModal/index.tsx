import DialogModal from '@/components/DialogModal'
import { modalStorage, ModalStorageState } from '@/libs/storage/modalStorage'
import { useGlobalStore } from '@/store'
import { appWindow } from '@tauri-apps/api/window'
import { Button } from 'antd'
import { observer } from 'mobx-react-lite'
import React from 'react'

const MaximizedModal = () => {
  const store = useGlobalStore()

  const closeModal = () => {
    store.setModalState('isShowMaximizedModal', false)
  }

  return (
    <DialogModal
      width={350}
      footer={
        <>
          <Button
            onClick={() => {
              modalStorage.setState(ModalStorageState.DISABLED_MAXIMIZE, true)
              closeModal()
            }}
          >
            不再提醒
          </Button>
          <Button onClick={closeModal}>取消</Button>
          <Button
            type='primary'
            onClick={async () => {
              appWindow.maximize()
              setTimeout(() => {
                closeModal()
              }, 300)
            }}
          >
            确定
          </Button>
        </>
      }
      visible={store.getModalState('isShowMaximizedModal')}
      onCancel={closeModal}
    >
      是否切换到最大化以获得更好的编辑体验?
    </DialogModal>
  )
}

export default observer(MaximizedModal)
