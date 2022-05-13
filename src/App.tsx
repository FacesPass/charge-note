import React from 'react'
import { routeConfig } from '@/routes'
import { useRoutes } from 'react-router-dom'
import Header from './layout/Header'

function App() {
  const routes = useRoutes(routeConfig)

  return (
    <>
      <Header />
      {routes}
    </>
  )
}

export default App
