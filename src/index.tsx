import React from 'react'
import ReactDOM from 'react-dom/client'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { initWindow, handleGlobalEvent } from './libs/project'
import zhCN from 'antd/lib/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import App from './App'
import 'antd/dist/antd.less'
import './styles/index.less'
import './styles/media.less'

moment.locale('zh-cn')

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <BrowserRouter>
    <ConfigProvider locale={zhCN} componentSize='small'>
      <App />
    </ConfigProvider>
  </BrowserRouter>,
)

initWindow()

handleGlobalEvent()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
