import Icon from '@/components/Icon'
import { Button, Modal } from 'antd'
import React, { FC, memo } from 'react'
import styles from './index.module.less'

interface IProps {
  visible: boolean
  onCancel?: () => void
}
const CreateMenuModal: FC<IProps> = ({ visible, onCancel }) => {
  return (
    <Modal width={300} visible={visible} footer={null} title='笔记创建' onCancel={onCancel}>
      <div className={styles.menu}>
        <Button icon={<Icon className='icon-wj-bjb' />} size='middle'>
          普通笔记
        </Button>
        <Button icon={<Icon className='icon-file-markdown' />} size='middle'>
          Markdown笔记
        </Button>
      </div>
    </Modal>
  )
}

export default memo(CreateMenuModal)
