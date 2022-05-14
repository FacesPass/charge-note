import React, { FC } from 'react'
import Icon from '@/components/Icon'
import { Button, Tooltip } from 'antd'
import { TooltipPlacement } from 'antd/lib/tooltip'

interface IProps {
  fontClass: string
  style?: React.CSSProperties
  className?: string
  toolTipPlacement?: TooltipPlacement
  toolTipTitle?: string
  isShowTooltip?: boolean
  onClick?: (e: React.MouseEvent) => void
}

const MenuItem: FC<IProps> = ({
  fontClass,
  style,
  className,
  isShowTooltip = true,
  toolTipTitle,
  toolTipPlacement = 'bottom',
  onClick,
}) => {
  return (
    <>
      {isShowTooltip ? (
        <Tooltip arrowPointAtCenter placement={toolTipPlacement} title={toolTipTitle}>
          <Button
            style={style}
            className={className}
            onClick={onClick}
            type='text'
            icon={<Icon type={fontClass} />}
          />
        </Tooltip>
      ) : (
        <Button
          style={style}
          className={className}
          onClick={onClick}
          type='text'
          icon={<Icon type={fontClass} />}
        />
      )}
    </>
  )
}

export default MenuItem
