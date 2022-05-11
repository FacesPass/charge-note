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
import Dialog from '@/components/Dialog'

const Editor = () => {
  const store = useGlobalStore()
  const editorMode = store.getState('editorMode')
  const location = useLocation()
  const filePath = (location.state as { path: string; name: string }).path
  const contentRef = useRef({ content: '' })
  const [content, setContent] = useState('')

  useEffect(() => {
    readFile()
  }, [])

  useEffect(() => {
    handleToggleMode()

    return () => {
      eventEmitter.off(MenuEvent.ToggleEditorMode)
    }
  }, [editorMode])

  useEffect(() => {
    eventEmitter.on(MenuEvent.Back, handleBack)

    return () => {
      eventEmitter.off(MenuEvent.Back)
    }
  }, [])

  const handleToggleMode = async () => {
    const isMaximize = await appWindow.isMaximized()
    if (editorMode === 'view') {
      if (!isMaximize) {
        eventEmitter.on(MenuEvent.ToggleEditorMode, () => {
          console.log(123)
        })
      }

      const markdownBody = document.querySelector('.markdown-body') as HTMLElement
      markdownBody.style.overflowY = 'auto'
      markdownBody.style.height = '100vh'
      markdownBody.style.padding = '0 20px 50px'
    }
  }

  const handleBack = async () => {
    await writeFile({ path: filePath, contents: contentRef.current.content })
  }

  const readFile = async () => {
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
      <Dialog />
      {store.getState('editorMode') === 'edit' ? (
        <MDEditor
          locale={zh}
          value={content}
          editorConfig={{
            tabSize: 2,
          }}
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
