import React, { FC, memo, useEffect, useRef, useState } from 'react'
import Icon from '@/components/Icon'
import { isEndsWithMd, isEndsWithTxt, isLegalFile } from '@/libs/utils/file'
import { fs } from '@tauri-apps/api'
import { Tooltip } from 'antd'
import styles from './index.module.less'
import ContextMenu from '@/components/ContextMenu'
import { IFsOutput } from '@/libs/backend/type'
import CustomMenu from './CutomMenu'

interface IProps {
  className?: string
  onClickItem?: (item: fs.FileEntry) => void
  fileList: IFsOutput[]
}

const FlatList: FC<IProps> = ({ fileList, className, onClickItem }) => {
  const listRef = useRef<HTMLDivElement | null>(null)
  const [isShowMenu, setIsShowMenu] = useState(false)
  const [menuLayout, setMenuLayout] = useState({ x: 0, y: 0 })
  const [selectedMenuItem, setSelectedMenuItem] = useState<IFsOutput>()

  useEffect(() => {
    handleCloseMenu()
  }, [fileList])

  useEffect(() => {
    listRef.current?.addEventListener('scroll', handleCloseMenu)

    return () => {
      listRef.current?.removeEventListener('scroll', handleCloseMenu)
    }
  }, [])

  const handleCloseMenu = () => {
    setIsShowMenu(false)
  }

  const handleFileListSequense = (fileList: IFsOutput[]) => [
    ...fileList.filter((item) => isLegalFile(item.name)),
    ...fileList.filter((item) => item.children),
  ]

  return (
    <>
      <div
        ref={listRef}
        className={`${styles.container} ${className}`}
        onClick={() => setIsShowMenu(false)}
      >
        {handleFileListSequense(fileList).length > 0 ? (
          handleFileListSequense(fileList)?.map((item) => (
            <div
              className={styles.listItem}
              key={item.path}
              onClick={() => {
                if (isShowMenu) {
                  setIsShowMenu(false)
                  return
                }
                onClickItem?.(item)
              }}
              onContextMenu={(e) => {
                e.preventDefault()
                setIsShowMenu(true)
                setMenuLayout({ x: e.clientX, y: e.clientY })
                setSelectedMenuItem(item)
              }}
            >
              <Tooltip title={item.name} mouseEnterDelay={1}>
                <div className={styles.name}>
                  {isEndsWithMd(item.name) ? (
                    <FileIcon type='icon-file-markdown' name={item.name} />
                  ) : isEndsWithTxt(item.name) ? (
                    <FileIcon type='icon-wenbenwenjian_file-text' name={item.name} />
                  ) : item?.children ? (
                    <FileIcon type='icon-dakaiwenjianjia' name={item.name} />
                  ) : (
                    <FileIcon type='icon-wenjian' name={item.name} />
                  )}
                </div>
              </Tooltip>
              <div className={styles.lastModifyTime}>最后编辑时间：{item.create_time}</div>
            </div>
          ))
        ) : (
          <div className={styles.tip}>暂无内容</div>
        )}
      </div>

      <ContextMenu x={menuLayout.x} y={menuLayout.y} visible={isShowMenu}>
        <CustomMenu menuItem={selectedMenuItem} />
      </ContextMenu>
    </>
  )
}

export default memo(FlatList)

const FileIcon: FC<{ type: string; name?: string }> = ({ type, name }) => {
  return (
    <Icon style={{ marginRight: '10px' }} type={type}>
      {name || '未知文件'}
    </Icon>
  )
}
