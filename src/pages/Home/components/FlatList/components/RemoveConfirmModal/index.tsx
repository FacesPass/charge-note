import React, { FC } from 'react'
import DialogModal from '@/components/DialogModal'
import { observer } from 'mobx-react-lite'
import { Button } from 'antd'
import { modalStorage, ModalStorageState } from '@/libs/storage/modalStorage'

interface IProps {
  visible?: boolean
  onOk?: () => void
  onCancel?: () => void
}

const RemoveConfirmModal: FC<IProps> = ({ visible, onOk, onCancel }) => {
  return (
    <DialogModal
      dangerIcon
      footer={
        <>
          <Button
            onClick={() => {
              modalStorage.setState(ModalStorageState.DISABELD_REMOVE_CONFIRM, true)
              onCancel?.()
            }}
          >
            不再提醒
          </Button>
          <Button onClick={onCancel}>取消</Button>
          <Button onClick={onOk} danger>
            确认
          </Button>
        </>
      }
      visible={visible}
      onCancel={onCancel}
    >
      将会同时删除该文件夹下所有内容，是否确认？
    </DialogModal>
  )
}

export default observer(RemoveConfirmModal)
