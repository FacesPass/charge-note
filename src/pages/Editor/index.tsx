import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useGlobalStore } from '@/store'
import { useLocation, useNavigate } from 'react-router-dom'
import { Editor as MDEditor, Viewer } from '@bytemd/react'
import zh from 'bytemd/locales/zh_Hans.json'
import gfm from '@bytemd/plugin-gfm'
import gfmZh from '@bytemd/plugin-gfm/locales/zh_Hans.json'
import gemoji from '@bytemd/plugin-gemoji'
import breaks from '@bytemd/plugin-breaks'
import frontmatter from '@bytemd/plugin-frontmatter'
import mediumZoom from '@bytemd/plugin-medium-zoom'
import math from '@bytemd/plugin-math'
import mathZh from '@bytemd/plugin-math/locales/zh_Hans.json'
import highlight from '@bytemd/plugin-highlight-ssr'
import { dialog, fs } from '@tauri-apps/api'
import eventEmitter, { MenuEvent } from '@/libs/events'
import { writeFile } from '@tauri-apps/api/fs'
import { observer } from 'mobx-react-lite'
import { appWindow } from '@tauri-apps/api/window'
import { modalStorage, ModalStorageState } from '@/storage/modalStorage'
import { useMount, useUnMount } from '@/libs/hooks'
import { message } from 'antd'
import SaveModal from '../../layout/GlobalModal/components/SaveModal'
import 'bytemd/dist/index.min.css'
import './reset.less'
import 'juejin-markdown-themes/dist/juejin.min.css'
import 'highlight.js/styles/default.css'
import styles from './index.module.less'
import { getCurrentTime } from '@/libs/utils/time'

const Editor = () => {
  const store = useGlobalStore()
  const navigate = useNavigate()
  const editorMode = store.getState('editorMode')
  const location = useLocation()
  const { filePath, name } = location.state as {
    filePath?: string
    name?: string
  }
  const workspacePath = store.getState('workspacePath')
  const stateRef = useRef({ rawContents: '', contents: '', savePath: '' })
  const [contents, setContents] = useState('')
  const [isShowSaveModal, setIsShowSaveModal] = useState(false)

  useEffect(() => {
    toggleMode()
  }, [editorMode])

  useMount(() => {
    readFile()
    eventEmitter.on(MenuEvent.Back, back)
    eventEmitter.on(MenuEvent.Save, save)
  })

  useUnMount(() => {
    appWindow.setTitle(store.getState('appName'))
    eventEmitter.off(MenuEvent.Back)
    eventEmitter.off(MenuEvent.Save)
  })

  const toggleMode = async () => {
    if (editorMode === 'view') {
      store.setModalState('isShowMaximizedModal', false)
    }
    if (modalStorage.getState(ModalStorageState.DISABLED_MAXIMIZE)) return
    const isMaximized = await appWindow.isMaximized()
    if (isMaximized) return
    if (editorMode === 'edit' && !isMaximized) {
      store.setModalState('isShowMaximizedModal', true)
    }

    eventEmitter.on(MenuEvent.ToggleEditorMode, () => {
      if (editorMode === 'view') {
        store.setModalState('isShowMaximizedModal', true)
      }
      eventEmitter.off(MenuEvent.ToggleEditorMode)
    })
  }

  const readFile = async () => {
    const workspacePath = store.getState('workspacePath')
    if (!filePath || !name || !workspacePath) return
    appWindow.setTitle(name)
    const contents = await fs.readTextFile(filePath)
    stateRef.current.rawContents = contents
    stateRef.current.contents = contents
    stateRef.current.savePath = `${workspacePath}\\${name}`
    setContents(contents)
  }

  const save = async () => {
    let { savePath, contents } = stateRef.current
    if (!savePath) {
      savePath = getNewSavePathWithWorkspace()
      stateRef.current.savePath = savePath
    }

    if (!savePath && !workspacePath) {
      savePath = await getNewSavePathWithoutWorkspace()
      stateRef.current.savePath = savePath
    }

    await fs.writeFile({ path: savePath, contents })
    appWindow.setTitle(savePath.substring(savePath.lastIndexOf('\\') + 1))
    refreshList()
    message.success('保存成功')
    store.setEditorState('isChanged', false)
  }

  const getNewSavePathWithoutWorkspace = async () => {
    return await dialog.save({
      filters: [
        { name: 'markdown文件', extensions: ['md'] },
        { name: 'txt文本', extensions: ['txt'] },
      ],
    })
  }

  const getNewSavePathWithWorkspace = () => {
    if (!workspacePath) return ''
    return `${workspacePath}\\${getCurrentTime(false, true, 'T')}.md`
  }

  const refreshList = () => {
    if (!workspacePath) return
    // 刷新列表
    store.updateFileList(workspacePath)
    store.closeAllModals()
  }

  const back = async () => {
    const contents = stateRef.current.contents
    const isAutoSave = modalStorage.getState(ModalStorageState.ALWAYS_AUTO_SAVE_IN_EDITOR)
    if (isAutoSave && filePath) {
      await writeFile({ path: filePath, contents })
      navigate('/')
      refreshList()
      store.setEditorState('isChanged', false)
      return
    }

    if (store.getEditorState('isChanged') && workspacePath) {
      setIsShowSaveModal(true)
      return
    }

    navigate('/')
    store.closeAllModals()
    store.setEditorState('isChanged', false)
  }

  const handleChange = (val: string) => {
    setContents(val)
    stateRef.current.contents = val
    store.setEditorState('isChanged', val !== stateRef.current.rawContents)
  }

  const plugins = useMemo(
    () => [
      gfm({ locale: gfmZh }),
      math({ locale: mathZh }),
      mediumZoom(),
      gemoji(),
      highlight(),
      breaks(),
      frontmatter(),
    ],
    [],
  )

  return (
    <>
      <div className={styles.container}>
        {store.getState('editorMode') === 'edit' ? (
          <MDEditor locale={zh} value={contents} plugins={plugins} onChange={handleChange} />
        ) : (
          <Viewer value={contents} plugins={plugins} />
        )}
      </div>
      <SaveModal
        isShowAutoSave={!!stateRef.current.savePath}
        visible={isShowSaveModal}
        onCancelVisible={() => {
          setIsShowSaveModal(false)
        }}
        onAlwaysSave={() => {
          modalStorage.setState(ModalStorageState.ALWAYS_AUTO_SAVE_IN_EDITOR, true)
          const { savePath, contents } = stateRef.current
          fs.writeFile({ path: savePath, contents })
          navigate('/')
        }}
        onCancel={() => {
          setIsShowSaveModal(false)
          navigate('/')
        }}
        onOk={() => {
          const { savePath, contents } = stateRef.current
          fs.writeFile({ path: savePath, contents })
          navigate('/')
        }}
      />
    </>
  )
}

export default observer(Editor)
