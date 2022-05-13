import React, { FC, memo } from 'react'
import Icon from '@/components/Icon'
import { isEndsWithMd } from '@/libs/utils/file'
import { fs } from '@tauri-apps/api'
import { Tooltip } from 'antd'
import styles from './index.module.less'

interface IProps {
  className?: string
  onClickItem?: (item: fs.FileEntry) => void
  fileList: fs.FileEntry[]
}
const FlatList: FC<IProps> = ({ fileList, className, onClickItem }) => {
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
            onContextMenu={(e) => {
              console.log(123)
              e.preventDefault()
            }}
          >
            <Tooltip title={item.name} mouseEnterDelay={1}>
              <div className={styles.name}>
                {isEndsWithMd(item.name) ? (
                  <Icon size={18} className='icon-file-markdown'>
                    {item.name}
                  </Icon>
                ) : item?.children ? (
                  <Icon size={18} className='icon-dakaiwenjianjia'>
                    {item.name}
                  </Icon>
                ) : (
                  <Icon size={18} className='icon-wenjian'>
                    {item.name}
                  </Icon>
                )}
              </div>
            </Tooltip>
          </div>
        ))
      ) : (
        <div className={styles.tip}>暂无内容</div>
      )}
    </div>
  )
}

export default memo(FlatList)
