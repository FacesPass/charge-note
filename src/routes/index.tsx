import React from 'react'
import { RouteObject } from 'react-router-dom'
import Home from '../pages/Home'
import Setting from '@/pages/Setting'
import Editor from '@/pages/Editor'
import KeepAlive from 'react-activation'

export const routeConfig: RouteObject[] = [
  {
    path: '/',
    index: true,
    element: (
      <KeepAlive>
        <Home />
      </KeepAlive>
    ),
  },
  { path: '/editor', element: <Editor /> },
  { path: '/setting', element: <Setting /> },
]
