import React, { useEffect, useRef, useState } from 'react'
import { appWindow } from '@tauri-apps/api/window'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { dialog, fs } from '@tauri-apps/api'
import { useGlobalStore } from '@/store'
import eventEmitter, { MenuEvent } from '@/libs/events'
import { observer } from 'mobx-react-lite'
import styles from './index.module.less'
import MenuItem from './components/MenuItem'

function Menu() {
  const navigate = useNavigate()
  const location = useLocation()
  const store = useGlobalStore()
  const editorMode = store.getState('editorMode')
  const [isInEditor, setIsInEditor] = useState(false)

  useEffect(() => {
    setIsInEditor(location.pathname === '/editor')
  }, [location])

  const handleWorkSpace = async () => {
    const dirPath = (await dialog.open({
      directory: true,
    })) as string

    if (dirPath) {
      store.setState('workspacePath', dirPath)
      store.setState('workspaceRoot', dirPath.slice(dirPath.lastIndexOf('\\') + 1))
      store.updateFileList(dirPath as string)
    }
  }

  const toEditor = async () => {
    store.setState('editorMode', 'edit')
    const isMaximized = await appWindow.isMaximized()
    if (!isMaximized) {
      store.setModalState('isShowMaximizedModal', true)
    }
    navigate('/editor', { state: { isNew: true } })
  }

  return (
    <>
      <div className={styles.container} onContextMenu={(e) => e.preventDefault()}>
        <div>
          {isInEditor && (
            <>
              <Link to='/' onClick={() => eventEmitter.emit(MenuEvent.Back)}>
                <MenuItem
                  style={{ marginRight: '5px' }}
                  toolTipTitle='返回'
                  fontClass='icon-fanhui'
                />
              </Link>
              <MenuItem
                style={{ marginRight: '5px' }}
                toolTipTitle='保存'
                fontClass='icon-baocun'
                onClick={() => eventEmitter.emit(MenuEvent.Save)}
              />
              <MenuItem
                style={{ marginRight: '5px' }}
                onClick={async () => {
                  const isMaximized = await appWindow.isMaximized()
                  if (isMaximized) return
                  appWindow.center()
                }}
                toolTipTitle='居中'
                fontClass='icon-juzhong'
              />
            </>
          )}
          <MenuItem
            style={{ marginRight: '5px' }}
            toolTipTitle='关于'
            fontClass='icon-guanyu'
            onClick={() => store.setModalState('isShowAboutModal', true)}
          />
          <MenuItem
            fontClass='icon-a-trayandarrowdownfill'
            toolTipTitle='隐藏到系统托盘'
            toolTipPlacement='bottomRight'
            onClick={() => appWindow.hide()}
          />
        </div>

        <div>
          {!isInEditor ? (
            <>
              <MenuItem
                style={{ marginRight: '5px' }}
                toolTipTitle='选择工作目录'
                toolTipPlacement='bottomLeft'
                fontClass='icon-dakaiwenjianjia'
                onClick={handleWorkSpace}
              />
              <MenuItem onClick={toEditor} toolTipTitle='新建' fontClass='icon-add' />
            </>
          ) : (
            <MenuItem
              onClick={() => {
                if (editorMode === 'view') {
                  store.setState('editorMode', 'edit')
                } else {
                  store.setState('editorMode', 'view')
                }
                eventEmitter.emit(MenuEvent.ToggleEditorMode)
              }}
              fontClass={editorMode === 'view' ? 'icon-chakan' : 'icon-meiridati'}
              toolTipPlacement='bottomLeft'
              toolTipTitle={`当前为${editorMode === 'view' ? '阅读' : '编辑'}模式`}
            />
          )}
        </div>
      </div>
      <div className={styles.placeholder}></div>
    </>
  )
}

export default observer(Menu)
