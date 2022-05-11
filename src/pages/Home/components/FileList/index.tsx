import React, { FC, memo } from 'react'
import Icon from '@/components/Icon'
import { isEndsWithMd } from '@/libs/utils/file'
import { fs } from '@tauri-apps/api'
import { Popconfirm, Tooltip } from 'antd'
import styles from './index.module.less'
import { WarningOutlined } from '@ant-design/icons'

interface IProps {
  className?: string
  onClickItem?: (item: fs.FileEntry) => void
  onRemoveFile?: (item: fs.FileEntry) => void
  fileList: fs.FileEntry[]
}
const FileList: FC<IProps> = ({ fileList, className, onClickItem, onRemoveFile }) => {
  const handleSequense = (fileList: fs.FileEntry[]) => [
    ...fileList.filter((item) => isEndsWithMd(item.name)),
    ...fileList.filter((item) => item.children),
  ]

  return (
    <div className={`${styles.container} ${className}`}>
      {handleSequense(fileList).length > 0 ? (
        handleSequense(fileList)?.map((item) => (
          <div
            className={styles.listItem}
            key={item.path}
            onClick={() => onClickItem?.(item)}
          >
            <Tooltip title={item.name} mouseEnterDelay={1}>
              <div className={styles.name}>
                {isEndsWithMd(item.name) ? (
                  <Icon className='icon-file-markdown'>{item.name}</Icon>
                ) : item?.children ? (
                  <Icon className='icon-wenjianjia'>{item.name}</Icon>
                ) : (
                  <Icon className='icon-wenjian'>{item.name}</Icon>
                )}
              </div>
            </Tooltip>
          </div>
        ))
      ) : (
        <div className={styles.tip}>暂无 Markdown 文件</div>
      )}
    </div>
  )
}

export default memo(FileList)
