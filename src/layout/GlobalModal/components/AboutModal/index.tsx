import React from 'react'
import { Modal } from 'antd'
import { useGlobalStore } from '@/store'
import { observer } from 'mobx-react-lite'

const AboutModal = () => {
  const store = useGlobalStore()

  return (
    <Modal
      width={350}
      title='关于'
      footer={null}
      visible={store.getModalState('isShowAboutModal')}
      onCancel={() => store.setModalState('isShowAboutModal', false)}
    >
      <p>应用名：{store.getState('appName')}</p>
      <p>版本号：{store.getState('appVersion')}</p>
      <p>开发者：JiquanWang99</p>
    </Modal>
  )
}

export default observer(AboutModal)
