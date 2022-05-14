import React, { useEffect, useLayoutEffect, useState } from 'react'
import { fs } from '@tauri-apps/api'
import FlatList from './components/FlatList'
import { observer } from 'mobx-react-lite'
import { useGlobalStore } from '@/store'
import PathTracing from './components/PathTracing'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { appWindow } from '@tauri-apps/api/window'
import { tracingHeightLayout } from '@/libs/dom'
import './index.less'

function Home() {
  const store = useGlobalStore()
  const navigate = useNavigate()
  const storeFileList = store.getState('fileList')

  useLayoutEffect(() => {
    setTimeout(() => {
      tracingHeightLayout()
    }, 0)
  }, [storeFileList])

  const handleClickItem = async ({ children, path, name }: fs.FileEntry) => {
    if (!children) {
      // 文件
      handleOpenFile({ name, path })
      return
    }

    // 文件夹
    store.setState('workspacePath', path)
    await store.updateFileList(path)
  }

  const handleOpenFile = ({ name, path }: fs.FileEntry) => {
    if (!name || !path) return

    appWindow.setTitle(name)
    navigate('/editor', { state: { path, name, isNew: false } })
  }

  const handleRemoveFile = async (item: fs.FileEntry) => {
    try {
      if (item.children) {
        await fs.removeDir(item.path, { recursive: true })
      } else {
        await fs.removeFile(item.path)
      }

      const workspacePath = store.getState('workspacePath')
      if (!workspacePath) return
      store.updateFileList(workspacePath)
      message.success('删除成功')
    } catch (e) {
      message.error('删除失败')
    }
  }

  return (
    <>
      <PathTracing className='path-tracing' />
      <FlatList className='file-list' fileList={storeFileList} onClickItem={handleClickItem} />
    </>
  )
}

export default observer(Home)
