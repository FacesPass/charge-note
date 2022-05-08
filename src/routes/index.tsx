import React from 'react'
import { RouteObject } from 'react-router-dom'
import Home from '../pages/Home'
import Setting from '@/pages/Setting'

export const routeConfig: RouteObject[] = [
  { path: '/', index: true, element: <Home /> },
  { path: '/setting', element: <Setting /> },
]