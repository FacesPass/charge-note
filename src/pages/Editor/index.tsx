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
import 'bytemd/dist/index.min.css'
import './reset.less'
import 'juejin-markdown-themes/dist/juejin.min.css'
import 'highlight.js/styles/default.css'
import { fs } from '@tauri-apps/api'
import eventEmitter, { MenuEvent } from '@/libs/events'
import { writeFile } from '@tauri-apps/api/fs'
import { observer } from 'mobx-react-lite'
import { appWindow } from '@tauri-apps/api/window'
import { markdownBodyLayout } from '@/libs/dom'

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

  const contentRef = useRef({ content: '' })
  const [content, setContent] = useState('')

  useEffect(() => {
    readFile()

    return () => {
      appWindow.setTitle(store.getState('appName'))
    }
  }, [])

  useEffect(() => {
    toggleMode()

    return () => {
      eventEmitter.off(MenuEvent.ToggleEditorMode)
    }
  }, [editorMode])

  useEffect(() => {
    eventEmitter.on(MenuEvent.Back, back)

    return () => {
      eventEmitter.off(MenuEvent.Back)
    }
  }, [])

  const toggleMode = async () => {
    if (editorMode === 'view') {
      markdownBodyLayout()
      if (store.getModalState('isShowMaximizedModal')) {
        store.setModalState('isShowMaximizedModal', false)
      }
    }
    if (localStorage.disabledMaximizeDialog) return

    const isMaximize = await appWindow.isMaximized()
    if (isMaximize) return

    eventEmitter.on(MenuEvent.ToggleEditorMode, () => {
      if (editorMode === 'view') {
        store.setModalState('isShowMaximizedModal', true)
      }
    })
  }

  const back = async () => {
    // 编辑模式返回时直接保存
    if (!isNew && filePath) {
      await writeFile({ path: filePath, contents: contentRef.current.content })
    }

    const workspacePath = store.getState('workspacePath')
    if (!workspacePath) return
    // 刷新列表获取最新编辑时间
    store.updateFileList(workspacePath)
    store.closeAllModals()
  }

  const readFile = async () => {
    if (!filePath || isNew || !name) return
    appWindow.setTitle(name)
    const content = await fs.readTextFile(filePath)
    contentRef.current.content = content
    setContent(content)
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
      {store.getState('editorMode') === 'edit' ? (
        <MDEditor
          locale={zh}
          value={content}
          plugins={plugins}
          onChange={(v) => {
            setContent(v)
            contentRef.current.content = v
          }}
        />
      ) : (
        <Viewer value={content} plugins={plugins} />
      )}
    </>
  )
}

export default observer(Editor)
