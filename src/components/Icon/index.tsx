import React, { memo, FC } from 'react'

interface IProps {
  className: string
  size?: number

  onClick?: (e: React.MouseEvent) => void
  children?: React.ReactNode
}

const Icon: FC<IProps> = ({ className, children, size, onClick }) => {
  return (
    <>
      {children ? (
        <span onClick={onClick} style={{ fontSize: size }}>
          <i className={`iconfont ${className}`} />
          {children}
        </span>
      ) : (
        <i
          onClick={onClick}
          style={{ fontSize: size }}
          className={`iconfont ${className}`}
        />
      )}
    </>
  )
}

export default memo(Icon)
