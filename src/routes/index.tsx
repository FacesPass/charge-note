import React from 'react'
import { RouteObject } from 'react-router-dom'
import Home from '../pages/Home'
import Setting from '@/pages/Setting'
import Editor from '@/pages/Editor'

export const routeConfig: RouteObject[] = [
  { path: '/', index: true, element: <Home /> },
  { path: '/editor', element: <Editor /> },
  { path: '/setting', element: <Setting /> },
]
