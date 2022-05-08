import { routeConfig } from '@/routes'
import React from 'react'
import { useRoutes } from 'react-router-dom'

function App() {
  const routes = useRoutes(routeConfig)
  return routes
}

export default App
