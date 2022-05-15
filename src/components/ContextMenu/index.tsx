import React, { FC, memo, useEffect, useRef, useState } from 'react'

interface IProps {
  x: number
  y: number
  visible?: boolean
  width?: number
  children?: React.ReactNode
}

const ContextMenu: FC<IProps> = ({ width = 200, x, y, visible, children }) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const [menuLayout, setMenuLayout] = useState({ x: 0, y: 0 })

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

    setMenuLayout({ x: xPos, y: yPos })
  }

  return (
    <>
      {visible && (
        <div
          ref={menuRef}
          style={{
            backgroundColor: '#fff',
            padding: '1px',
            border: '1px solid #e7e7e7',
            position: 'absolute',
            left: menuLayout.x,
            top: menuLayout.y,
            width: `${width}px`,
          }}
        >
          {children}
        </div>
      )}
    </>
  )
}

export default memo(ContextMenu)
