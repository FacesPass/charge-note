import { ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import React, { memo } from 'react'
import styles from './index.module.less'

function Dialog() {
  return (
    <Modal visible={false} width={350} closable={false}>
      <div className={styles.container}>
        <InfoCircleOutlined style={{ fontSize: '20px', color: '#1890FF' }} />
        <div className={styles.content}>哈哈哈哈哈</div>
      </div>
    </Modal>
  )
}

export default memo(Dialog)
