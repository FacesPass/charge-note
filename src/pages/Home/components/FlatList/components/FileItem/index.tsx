import Icon from '@/components/Icon'
import { Tooltip } from 'antd'
import React, { FC, memo } from 'react'

const FileItem: FC<{ type: string; name?: string }> = ({ type, name }) => {
  return (
    <Icon style={{ marginRight: '10px' }} type={type}>
      <Tooltip title={name} mouseEnterDelay={1}>
        {name || '未知文件'}
      </Tooltip>
    </Icon>
  )
}

export default memo(FileItem)
