import React, { FC, memo, useEffect, useRef, useState } from 'react'
import styles from './index.module.less'
interface IProps {
  x: number
  y: number
  visible?: boolean
  width?: number
  children?: React.ReactNode
}

const ContextMenu: FC<IProps> = ({ width = 200, x, y, visible, children }) => {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    checkIsCollision()
  }, [x, y])

  const checkIsCollision = () => {
    const body = document.body
    const menuDom = menuRef.current
    if (!body || !menuDom) return

    let xPos = x
    let yPos = y

    if (xPos + menuDom.offsetWidth > body.offsetWidth) {
      xPos = xPos - menuDom.offsetWidth
    }

    if (yPos + menuDom.offsetHeight > body.offsetHeight) {
      yPos = yPos - menuDom.offsetHeight
    }

    menuDom.style.left = xPos + 'px'
    menuDom.style.top = yPos + 'px'
    menuDom.style.width = width + 'px'
  }

  return (
    <>
      {visible && (
        <div className={styles.container} ref={menuRef}>
          {children}
        </div>
      )}
    </>
  )
}

export default memo(ContextMenu)
