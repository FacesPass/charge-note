import React, { FC, memo } from 'react'
import styles from './index.module.less'

export interface IMenuItem {
  label: string
  key: string
  isShow?: boolean
  onClick?: () => void
}

interface IProps {
  menus: IMenuItem[]
}

const CustomMenu: FC<IProps> = ({ menus }) => {
  return (
    <>
      {menus.map((item) => (
        <div
          style={{ display: `${item.isShow ?? true ? 'block' : 'none'}` }}
          className={styles.menuItem}
          onClick={() => {
            item.onClick?.()
          }}
          key={item.key}
        >
          <span key={item.key} className={styles.menuText}>
            {item.label}
          </span>
        </div>
      ))}
    </>
  )
}

export default memo(CustomMenu)
