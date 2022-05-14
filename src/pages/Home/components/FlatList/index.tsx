import React, { FC, memo } from 'react'
import Icon from '@/components/Icon'
import { isEndsWithMd, isEndsWithTxt, isLegalFile } from '@/libs/utils/file'
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
    ...fileList.filter((item) => isLegalFile(item.name)),
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
              e.preventDefault()
            }}
          >
            <Tooltip title={item.name} mouseEnterDelay={1}>
              <div className={styles.name}>
                {isEndsWithMd(item.name) ? (
                  <Icon style={{ marginRight: '10px' }} type='icon-file-markdown'>
                    {item.name}
                  </Icon>
                ) : isEndsWithTxt(item.name) ? (
                  <Icon style={{ marginRight: '10px' }} type='icon-wenbenwenjian_file-text'>
                    {item.name}
                  </Icon>
                ) : item?.children ? (
                  <Icon style={{ marginRight: '10px' }} type='icon-dakaiwenjianjia'>
                    {item.name}
                  </Icon>
                ) : (
                  <Icon style={{ marginRight: '10px' }} type='icon-wenjian'>
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
