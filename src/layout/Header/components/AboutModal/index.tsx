import React, { FC, memo, useEffect, useState } from 'react'
import { app } from '@tauri-apps/api'
import { Modal } from 'antd'

interface IProps {
  visible: boolean
  onCancel: () => void
}

const AboutModal: FC<IProps> = ({ visible, onCancel }) => {
  const [appName, setAppName] = useState('')
  const [version, setVersion] = useState('')
  useEffect(() => {
    getAppInfo()
  }, [])

  const getAppInfo = async () => {
    const appName = await app.getName()
    const version = await app.getVersion()
    setAppName(appName)
    setVersion(version)
  }
  return (
    <Modal width={350} title='关于' footer={null} visible={visible} onCancel={onCancel}>
      <p>应用名：{appName}</p>
      <p>版本号：{version}</p>
      <p>开发者：JiquanWang99</p>
    </Modal>
  )
}

export default memo(AboutModal)
