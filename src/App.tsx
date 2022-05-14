import React from 'react'
import { routeConfig } from '@/routes'
import { useRoutes } from 'react-router-dom'
import Menu from './layout/Menu'
import Modal from './layout/Modal'

function App() {
  const routes = useRoutes(routeConfig)

  return (
    <>
      <Menu />
      <Modal />
      {routes}
    </>
  )
}

export default App
