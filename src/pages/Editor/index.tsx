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
import { markdownBodyLayout } from '@/libs/dom'
import { Button } from 'antd'

const Editor = () => {
  const store = useGlobalStore()
  const editorMode = store.getState('editorMode')
  const location = useLocation()
  const filePath = (location.state as { path: string; name: string }).path
  const contentRef = useRef({ content: '' })
  const [content, setContent] = useState('')
  const [isShowDialog, setIsShowDialog] = useState(false)

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
    if (editorMode === 'view') {
      if (!localStorage.disabledMaximizeDialog) {
        const isMaximize = await appWindow.isMaximized()
        if (!isMaximize) {
          eventEmitter.on(MenuEvent.ToggleEditorMode, () => {
            setIsShowDialog(true)
          })
        }
      }

      markdownBodyLayout()
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
      <Dialog
        width={400}
        footer={
          <>
            <Button
              onClick={() => {
                localStorage.disabledMaximizeDialog = true
                setIsShowDialog(false)
              }}
            >
              不再提醒
            </Button>
            <Button onClick={() => setIsShowDialog(false)}>取消</Button>
            <Button
              type='primary'
              onClick={async () => {
                appWindow.maximize()
                setTimeout(() => {
                  setIsShowDialog(false)
                }, 100)
              }}
            >
              确定
            </Button>
          </>
        }
        visible={isShowDialog}
        onCancel={() => setIsShowDialog(false)}
      >
        是否切换到全屏模式以获得更好的编辑体验?
      </Dialog>
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
