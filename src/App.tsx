import React, { useEffect } from 'react'
import { routeConfig } from '@/routes'
import { useRoutes } from 'react-router-dom'
import Menu from './layout/Menu'
import Modal from './layout/Modal'
import { useGlobalStore } from './store'
import { app } from '@tauri-apps/api'

function App() {
  const store = useGlobalStore()
  const routes = useRoutes(routeConfig)

  useEffect(() => {
    getAppInfo()
  }, [])

  const getAppInfo = async () => {
    const appName = await app.getName()
    const version = await app.getVersion()
    store.setState('appName', appName)
    store.setState('appVersion', version)
  }

  return (
    <>
      <Menu />
      <Modal />
      {routes}
    </>
  )
}

export default App
