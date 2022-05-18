import React, { FC, memo, useEffect, useRef, useState } from 'react'
import { Button, Input, InputRef, message } from 'antd'
import Modal from 'antd/lib/modal/Modal'

interface IProps {
  title: string
  visible?: boolean
  onOk?: (val: string) => void
  onCancel?: () => void
}

const CreateInputModal: FC<IProps> = ({ title, visible, onCancel, onOk }) => {
  const [val, setVal] = useState('')
  const iptRef = useRef<InputRef | null>(null)

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        iptRef.current?.focus()
      }, 0)
    }
  }, [visible])

  const closeModal = () => {
    setVal('')
    onCancel?.()
  }

  return (
    <Modal
      width={350}
      visible={visible}
      onCancel={closeModal}
      footer={
        <>
          <Button onClick={closeModal}>关闭</Button>
          <Button
            type='primary'
            onClick={() => {
              if (!val) {
                message.warn('请输入内容')
                return
              }
              onOk?.(val)
              setVal('')
            }}
          >
            确定
          </Button>
        </>
      }
      closable={false}
    >
      <span>{title}</span>
      <Input ref={iptRef} value={val} onChange={(e) => setVal(e.target.value)} />
    </Modal>
  )
}

export default memo(CreateInputModal)
