import React, { FC, memo } from 'react'
import DialogModal from '@/components/DialogModal'
import { Button } from 'antd'

interface IProps {
  visible?: boolean
  isShowAutoSave?: boolean
  onAlwaysSave?: () => void
  onCancelVisible?: () => void
  onCancel?: () => void
  onOk?: () => void
}

const SaveModal: FC<IProps> = ({
  visible,
  isShowAutoSave,
  onCancel,
  onCancelVisible,
  onAlwaysSave,
  onOk,
}) => {
  return (
    <DialogModal
      onCancel={onCancelVisible}
      visible={visible}
      footer={
        <>
          {isShowAutoSave && <Button onClick={onAlwaysSave}>总是自动保存</Button>}
          <Button onClick={onCancel}>不保存</Button>
          <Button onClick={onOk} type='primary'>
            保存
          </Button>
        </>
      }
    >
      当前内容暂未保存，是否保存？
    </DialogModal>
  )
}

export default memo(SaveModal)
