import React, { useEffect, useLayoutEffect, useState } from 'react'
import { fs } from '@tauri-apps/api'
import FileList from './components/FileList'
import { observer } from 'mobx-react-lite'
import { useGlobalStore } from '@/store'
import PathTracing from './components/PathTracing'
import { isEndsWithMd } from '@/libs/utils/file'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { appWindow } from '@tauri-apps/api/window'

function Home() {
  const store = useGlobalStore()
  const navigate = useNavigate()
  const storeFileList = store.getState('fileList')

  useEffect(() => {
    setTimeout(() => {
      handleAutoTracingHeight()
    }, 0)
  }, [storeFileList])

  const handleAutoTracingHeight = () => {
    const tracingHeight = (document.querySelector('.path-tracing') as HTMLElement)
      .offsetHeight
    ;(document.querySelector('.file-list') as HTMLElement).style.marginTop =
      tracingHeight + 'px'
  }

  const handleClickItem = async ({ children, path, name }: fs.FileEntry) => {
    if (!children) {
      // 文件
      if (!isEndsWithMd(name)) {
        message.warn('不支持该格式文件')
        return
      }

      if (!name) return
      appWindow.setTitle(name)
      navigate('/editor', { state: { path, name } })
      return
    }

    // 文件夹
    store.setState('workspacePath', path)
    const fileList = await fs.readDir(path)
    store.setState('fileList', fileList)
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
      console.log(e)
      message.error('删除失败')
    }
  }

  return (
    <>
      <PathTracing className='path-tracing' />
      <FileList
        className='file-list'
        fileList={storeFileList}
        onClickItem={handleClickItem}
        onRemoveFile={handleRemoveFile}
      />
    </>
  )
}

export default observer(Home)
