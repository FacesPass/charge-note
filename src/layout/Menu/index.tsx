import React, { useEffect, useState } from 'react'
import { appWindow } from '@tauri-apps/api/window'
import { useLocation, Link } from 'react-router-dom'
import { dialog } from '@tauri-apps/api'
import { useGlobalStore } from '@/store'
import eventEmitter, { MenuEvent } from '@/libs/events'
import { observer } from 'mobx-react-lite'
import styles from './index.module.less'
import MenuItem from './components/MenuItem'

function Menu() {
  const location = useLocation()
  const store = useGlobalStore()
  const editorMode = store.getState('editorMode')
  const [isInEditor, setIsInEditor] = useState(false)

  useEffect(() => {
    const isInEditor = location.pathname === '/editor'

    setIsInEditor(isInEditor)
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

  return (
    <>
      <div className={styles.container}>
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
                onClick={async () => {
                  const isMaximized = await appWindow.isMaximized()
                  if (isMaximized) return
                  appWindow.center()
                }}
                toolTipTitle='居中'
                fontClass='icon-pingmujuzhong_screenCenter_01'
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

              <Link to='/editor' state={{ isNew: true }}>
                <MenuItem toolTipTitle='新建' fontClass='icon-add' />
              </Link>
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
