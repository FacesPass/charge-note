import { routeConfig } from '@/routes'
import { useRoutes } from 'react-router-dom'
import { handleWindow } from './libs/project'

function App() {
  const routes = useRoutes(routeConfig)

  handleWindow()
  return routes
}

export default App
