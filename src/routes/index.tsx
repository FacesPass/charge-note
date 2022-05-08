import React from 'react'
import { RouteObject } from 'react-router-dom'
import Home from '../pages/Home'

export const routeConfig: RouteObject[] = [
  { path: '/', index: true, element: <Home /> },
]
