import React, { memo, FC } from 'react'
import { createFromIconfontCN } from '@ant-design/icons'

const AntIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_3388204_vppptxaxduh.js', // 在 iconfont.cn 上生成
})

interface IProps {
  type: string
  className?: string
  style?: React.CSSProperties
  size?: number | string
  onClick?: (e: React.MouseEvent) => void
  children?: React.ReactNode
}

const Icon: FC<IProps> = ({ type, className, style, children, size = 18, onClick }) => {
  return (
    <>
      {children ? (
        <div onClick={onClick}>
          <AntIcon
            className={`iconfont ${className}`}
            style={{ fontSize: size, ...style }}
            type={type}
          />
          {children}
        </div>
      ) : (
        <AntIcon
          className={`iconfont ${className}`}
          style={{ fontSize: size, ...style }}
          type={type}
          onClick={onClick}
        />
      )}
    </>
  )
}

export default memo(Icon)
