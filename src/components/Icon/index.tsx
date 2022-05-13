import React, { memo, FC } from 'react'
import { createFromIconfontCN } from '@ant-design/icons'

const AntIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_3388204_y3yuugl7ctj.js', // 在 iconfont.cn 上生成
})

interface IProps {
  className: string
  size?: number | string
  onClick?: (e: React.MouseEvent) => void
  children?: React.ReactNode
}

const Icon: FC<IProps> = ({ className, children, size = 30, onClick }) => {
  return (
    <>
      {children ? (
        <div onClick={onClick}>
          <AntIcon className='iconfont' style={{ fontSize: size }} type={className} />
          {children}
        </div>
      ) : (
        <AntIcon
          className='iconfont'
          style={{ fontSize: size }}
          type={className}
          onClick={onClick}
        />
      )}
    </>
  )
}

export default memo(Icon)
