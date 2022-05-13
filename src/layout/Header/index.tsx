import React, { useEffect, useState } from 'react'
import { Button, Tooltip } from 'antd'
import { appWindow } from '@tauri-apps/api/window'
import AboutModal from './components/AboutModal'
import Search from './components/Search'
import { useLocation, Link } from 'react-router-dom'
import styles from './index.module.less'
import { dialog } from '@tauri-apps/api'
import { useGlobalStore } from '@/store'
import Icon from '@/components/Icon'
import eventEmitter, { MenuEvent } from '@/libs/events'
import { observer } from 'mobx-react-lite'

function Header() {
  const location = useLocation()
  const store = useGlobalStore()
  const editorMode = store.getState('editorMode')
  const [isInEditor, setIsInEditor] = useState(false)
  const [isShowAboutModal, setIsShowAboutModal] = useState(false)
  const [isShowSearch, setIsShowSearch] = useState(false)

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
      <AboutModal
        visible={isShowAboutModal}
        onCancel={() => setIsShowAboutModal(false)}
      />
      <Search visible={isShowSearch} onCancel={() => setIsShowSearch(false)} />

      <div className={styles.container}>
        <div>
          {isInEditor && (
            <>
              <Link to='/' onClick={() => eventEmitter.emit(MenuEvent.Back)}>
                <Button type='text'>返回</Button>
              </Link>
              <Button
                type='text'
                onClick={async () => {
                  const isMaximized = await appWindow.isMaximized()
                  if (isMaximized) return
                  appWindow.center()
                }}
              >
                居中
              </Button>
            </>
          )}
          <Button type='text' onClick={() => setIsShowAboutModal(true)}>
            关于
          </Button>
          <Button type='text' onClick={() => appWindow.hide()}>
            隐藏
          </Button>
        </div>

        <div>
          {!isInEditor && (
            <Tooltip title='选择工作区' placement='bottomLeft' arrowPointAtCenter>
              <Button
                icon={<Icon className='icon-dakaiwenjianjia' />}
                type='text'
                onClick={handleWorkSpace}
              />
            </Tooltip>
          )}
          {isInEditor && (
            <Tooltip
              title={`当前为${editorMode === 'view' ? '阅读' : '编辑'}模式`}
              placement='bottomLeft'
              arrowPointAtCenter
            >
              <Button
                icon={
                  <Icon
                    className={editorMode === 'view' ? 'icon-chakan' : 'icon-meiridati'}
                  />
                }
                type='text'
                onClick={() => {
                  if (editorMode === 'view') {
                    store.setState('editorMode', 'edit')
                  } else {
                    store.setState('editorMode', 'view')
                  }
                  eventEmitter.emit(MenuEvent.ToggleEditorMode)
                }}
              />
            </Tooltip>
          )}
        </div>
      </div>
      <div className={styles.placeholder}></div>
    </>
  )
}

export default observer(Header)
