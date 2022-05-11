import React, { memo, FC } from 'react'
import { Input } from 'antd'
import { UpCircleOutlined } from '@ant-design/icons'
import styles from './index.module.less'

interface IProps {
  visible: boolean
  onCancel?: () => void
  onSearch?: () => void
  placeholder?: string
}

const Search: FC<IProps> = ({
  visible,
  placeholder = '请输入要搜索的内容',
  onCancel,
  onSearch,
}) => {
  return visible ? (
    <Input.Search
      className={styles.search}
      addonBefore={
        <span style={{ cursor: 'pointer' }} onClick={onCancel}>
          <UpCircleOutlined />
        </span>
      }
      placeholder={placeholder}
      onSearch={onSearch}
    />
  ) : null
}

export default memo(Search)
