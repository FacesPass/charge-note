import { InfoCircleOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import React, { FC, memo } from 'react'
import styles from './index.module.less'

interface IProps {
  visible?: boolean
  width?: number
  children?: React.ReactNode
  footer?: React.ReactNode
  dangerIcon?: boolean
  onCancel?: () => void
}

const DialogModal: FC<IProps> = ({
  visible,
  width = 350,
  footer = null,
  dangerIcon = false,
  children = '请输入内容',
  onCancel,
}) => {
  return (
    <Modal footer={footer} visible={visible} width={width} closable={false} onCancel={onCancel}>
      <div className={styles.container}>
        <InfoCircleOutlined
          style={{ fontSize: '20px', color: `${dangerIcon ? 'red' : '#1890FF'}` }}
        />
        <div className={styles.content}>{children}</div>
      </div>
    </Modal>
  )
}

export default memo(DialogModal)
