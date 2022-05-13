import React, { useEffect } from 'react'
import { fs } from '@tauri-apps/api'
import FlatList from './components/FlatList'
import { observer } from 'mobx-react-lite'
import { useGlobalStore } from '@/store'
import PathTracing from './components/PathTracing'
import { isEndsWithMd } from '@/libs/utils/file'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { appWindow } from '@tauri-apps/api/window'
import { tracingHeightLayout } from '@/libs/dom'
import TreeList from './components/TreeList'

function Home() {
  const store = useGlobalStore()
  const navigate = useNavigate()
  const storeFileList = store.getState('fileList')
  const listShowMode = store.getState('listShowMode')

  useEffect(() => {
    if (listShowMode === 'flat') {
      setTimeout(() => {
        tracingHeightLayout()
      }, 0)
    }
  }, [storeFileList, listShowMode])

  const handleClickItem = async ({ children, path, name }: fs.FileEntry) => {
    if (!children) {
      // 文件
      if (!isEndsWithMd(name)) {
        message.warn('不支持该格式文件')
        return
      }

      handleOpenFile({ name, path })
      return
    }

    // 文件夹
    store.setState('workspacePath', path)
    const fileList = await fs.readDir(path)
    store.setState('fileList', fileList)
  }

  const handleOpenFile = ({ name, path }: fs.FileEntry) => {
    if (!name || !path) return

    appWindow.setTitle(name)
    navigate('/editor', { state: { path, name } })
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
      <div style={{ display: listShowMode === 'flat' ? 'block' : 'none' }}>
        <PathTracing className='path-tracing' />
        <FlatList
          className='file-list'
          fileList={storeFileList}
          onClickItem={handleClickItem}
        />
      </div>
      <TreeList
        style={{ display: listShowMode === 'tree' ? 'block' : 'none' }}
        fileList={storeFileList}
        onClickFile={handleOpenFile}
      />
    </>
  )
}

export default observer(Home)
