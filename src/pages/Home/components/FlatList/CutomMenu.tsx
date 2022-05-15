import React, { FC, memo } from 'react'
import { IFsOutput } from '@/libs/backend/type'
import styles from './index.module.less'

interface IMenuItems {
  label: string
  key: string
  onClick?: (menuItem: IFsOutput, index: number) => void
}

const CustomMenu: FC<{ menuItem?: IFsOutput }> = ({ menuItem }) => {
  const menuItems: IMenuItems[] = [
    {
      label: '新建文件',
      key: 'newFile',
      onClick: (menuItem) => {
        console.log(menuItem)
      },
    },
    {
      label: '新建文件夹',
      key: 'newDir',
    },
    {
      label: '打开文件夹',
      key: 'openDir',
    },
    {
      label: '复制路径',
      key: 'copyPath',
    },
    {
      label: '删除',
      key: 'remove',
    },
  ]
  return (
    <div className={styles.customMenu}>
      {menuItems.map((item, index) => (
        <>
          <div
            className={styles.menuItem}
            onClick={() => {
              if (!menuItem) return
              item.onClick?.(menuItem, index)
            }}
            key={item.key}
          >
            <span key={item.key} className={styles.menuText}>
              {item.label}
            </span>
          </div>
        </>
      ))}
    </div>
  )
}

export default memo(CustomMenu)
