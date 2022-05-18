import { useGlobalStore } from '@/store'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
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
import { markdownBodyLayout } from '@/libs/dom'
import { modalStorage, ModalStorageState } from '@/libs/storage/modalStorage'
import { useMount, useUnMount } from '@/libs/hooks'
import { message } from 'antd'
import styles from './index.module.less'
import 'bytemd/dist/index.min.css'
import './reset.less'
import 'juejin-markdown-themes/dist/juejin.min.css'
import 'highlight.js/styles/default.css'

const Editor = () => {
  const store = useGlobalStore()
  const editorMode = store.getState('editorMode')
  const location = useLocation()
  const {
    isNew,
    path: filePath,
    name,
  } = location.state as {
    isNew: boolean
    path?: string
    name?: string
  }
  const stateRef = useRef({ contents: '', savePath: '', isSave: false })
  const [contents, setContents] = useState('')

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
      markdownBodyLayout()
      if (store.getModalState('isShowMaximizedModal')) {
        store.setModalState('isShowMaximizedModal', false)
      }
    }
    if (modalStorage.getState(ModalStorageState.DISABLED_MAXIMIZE)) return

    const isMaximize = await appWindow.isMaximized()
    if (isMaximize) return

    eventEmitter.on(MenuEvent.ToggleEditorMode, () => {
      if (editorMode === 'view') {
        store.setModalState('isShowMaximizedModal', true)
      }
    })
  }

  const save = async () => {
    const workspacePath = store.getState('workspacePath')
    let savePath = stateRef.current.savePath
    if (workspacePath || savePath) {
      if (!stateRef.current.savePath) {
        savePath = `${workspacePath}\\${+new Date()}.md`
        stateRef.current.savePath = savePath
      } else {
        savePath = stateRef.current.savePath
      }
    } else {
      savePath = await dialog.save({
        filters: [
          { name: 'markdown文件', extensions: ['md'] },
          { name: 'txt文本', extensions: ['txt'] },
        ],
      })
      stateRef.current.savePath = savePath
    }

    await fs.writeFile({ path: savePath, contents: stateRef.current.contents })
    appWindow.setTitle(savePath.substring(savePath.lastIndexOf('\\') + 1))
    stateRef.current.isSave = true
    message.success('保存成功')
  }

  const back = async () => {
    // 编辑模式返回时直接保存
    if (!isNew && filePath) {
      await writeFile({ path: filePath, contents: stateRef.current.contents })
    }

    const workspacePath = store.getState('workspacePath')
    if (!workspacePath) return
    // 刷新列表获取最新编辑时间
    store.updateFileList(workspacePath)
    store.closeAllModals()
  }

  const readFile = async () => {
    const workspacePath = store.getState('workspacePath')
    if (!filePath || isNew || !name || !workspacePath) return
    appWindow.setTitle(name)
    const contents = await fs.readTextFile(filePath)
    stateRef.current.contents = contents
    stateRef.current.savePath = `${workspacePath}\\${name}`
    setContents(contents)
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
    <div className={styles.container}>
      {store.getState('editorMode') === 'edit' ? (
        <MDEditor
          locale={zh}
          value={contents}
          plugins={plugins}
          onChange={(v) => {
            setContents(v)
            stateRef.current.contents = v
            stateRef.current.isSave = false
          }}
        />
      ) : (
        <Viewer value={contents} plugins={plugins} />
      )}
    </div>
  )
}

export default observer(Editor)
