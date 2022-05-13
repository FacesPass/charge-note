import React from 'react'
import { routeConfig } from '@/routes'
import { useRoutes } from 'react-router-dom'
import Header from './layout/Header'
import { AliveScope } from 'react-activation'
function App() {
  const routes = useRoutes(routeConfig)

  return (
    <>
      <Header />
      <AliveScope>{routes}</AliveScope>
    </>
  )
}

export default App
