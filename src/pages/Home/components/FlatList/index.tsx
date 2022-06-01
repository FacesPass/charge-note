import React, { FC, useEffect, useMemo, useRef } from 'react'
import { isEndsWithMd, isEndsWithTxt } from '@/libs/utils/file'
import { fs, shell } from '@tauri-apps/api'
import ContextMenu from '@/components/ContextMenu'
import { IFsOutput } from '@/libs/backend/type'
import CustomMenu, { IMenuItem } from './components/CustomMenu'
import { copy } from '@/libs/utils/command'
import { message } from 'antd'
import FileItem from './components/FileItem'
import { useGlobalStore } from '@/store'
import { useNavigate } from 'react-router-dom'
import { modalStorage, ModalStorageState } from '@/storage/modalStorage'
import { observer } from 'mobx-react-lite'
import CreateInputModal from '@/components/CreateInputModal'
import RemoveConfirmModal from './components/RemoveConfirmModal'
import { useMount, useSetState, useUnMount } from '@/libs/hooks'
import debounce from 'lodash.debounce'
import styles from './index.module.less'

interface IProps {
  className?: string
  fileList: IFsOutput[]
}

const FlatList: FC<IProps> = ({ fileList, className }) => {
  const store = useGlobalStore()
  const navigate = useNavigate()
  const selectedMenuItemRef = useRef<IFsOutput | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)
  const [menuState, setMenuState] = useSetState({ isShow: false, x: 0, y: 0 })
  const [modalState, setModalState] = useSetState({
    isShowCreateFileModal: false,
    isShowCreateDirModal: false,
    isShowRemoveConfirmModal: false,
  })
  const isPageMenu = selectedMenuItemRef.current === null
  const isDir = !!selectedMenuItemRef.current?.children

  useEffect(() => {
    closeMenu()
  }, [fileList])

  useMount(() => listRef.current?.addEventListener('scroll', closeMenu))
  useUnMount(() => listRef.current?.removeEventListener('scroll', closeMenu))

  const menus: IMenuItem[] = useMemo(
    () => [
      {
        label: '新建文件',
        key: 'newFile',
        isShow: isDir || isPageMenu,
        onClick: () => {
          closeMenu()
          setModalState({
            isShowCreateFileModal: true,
          })
        },
      },
      {
        label: '新建文件夹',
        key: 'newDir',
        isShow: isDir || isPageMenu,
        onClick: () => {
          closeMenu()
          setModalState({
            isShowCreateDirModal: true,
          })
        },
      },
      {
        label: '打开所在位置',
        key: 'openInExplorer',
        onClick: async () => {
          try {
            const workspacePath = store.getState('workspacePath')
            workspacePath && shell.open(workspacePath)
            closeMenu()
          } catch (e) {
            message.error('打开失败')
          }
        },
      },
      {
        label: '复制路径',
        key: 'copyPath',
        isShow: !isPageMenu,
        onClick: async () => {
          try {
            const selectedMenuItem = selectedMenuItemRef.current
            if (!selectedMenuItem) return
            await copy(selectedMenuItem.path)
            message.success('已复制到剪贴板')
            closeMenu()
          } catch (e) {
            message.error('复制失败')
          }
        },
      },
      {
        label: '复制',
        key: 'copy',
        isShow: !isPageMenu,
      },
      {
        label: '剪切',
        key: 'cut',
        isShow: !isPageMenu,
      },
      {
        label: '删除',
        key: 'remove',
        isShow: !isPageMenu,
        onClick: async () => {
          const selectedMenuItem = selectedMenuItemRef.current
          if (!selectedMenuItem) return
          closeMenu()
          try {
            const isDir = !!selectedMenuItem.children
            if (isDir) {
              if (modalStorage.getState(ModalStorageState.DISABELD_REMOVE_CONFIRM)) {
                await fs.removeDir(selectedMenuItem.path, { recursive: true })
                refreshFileList()
                return
              }

              const targetRemoveDir = await fs.readDir(selectedMenuItem.path)
              if (targetRemoveDir.length === 0) {
                await fs.removeDir(selectedMenuItem.path)
                refreshFileList()
                return
              }

              setModalState({
                isShowRemoveConfirmModal: true,
              })
            } else {
              await fs.removeFile(selectedMenuItem.path)
              refreshFileList()
            }
          } catch (e) {
            message.error('删除失败')
          }
        },
      },
    ],
    [selectedMenuItemRef.current],
  )

  const closeMenu = debounce(() => setMenuState({ isShow: false }), 100, { leading: true })

  const refreshFileList = () => {
    const workspacePath = store.getState('workspacePath')
    if (!workspacePath) return
    store.updateFileList(workspacePath)
  }

  const createDir = async (inputVal: string) => {
    const selectedMenuItem = selectedMenuItemRef.current
    try {
      const workspacePath = store.getState('workspacePath')
      if (!workspacePath) return

      let pathToCreate
      if (selectedMenuItem) {
        pathToCreate = `${selectedMenuItem.path}\\${inputVal}`
      } else {
        pathToCreate = `${store.getState('workspacePath')}\\${inputVal}`
      }

      await fs.createDir(pathToCreate)
      store.updateFileList(pathToCreate)
      store.setState('workspacePath', pathToCreate)

      setModalState({
        isShowCreateDirModal: false,
      })
    } catch (e) {
      message.warn('文件夹已存在')
    }
  }

  const createFile = async (inputVal: string) => {
    const selectedMenuItem = selectedMenuItemRef.current
    try {
      const workspacePath = store.getState('workspacePath')
      if (!workspacePath) return

      let pathToCreate
      if (selectedMenuItem) {
        pathToCreate = `${selectedMenuItem.path}\\${inputVal}.md`
      } else {
        pathToCreate = `${workspacePath}\\${inputVal}.md`
      }
      await fs.writeFile({ path: pathToCreate, contents: '' })

      if (selectedMenuItem) {
        store.updateFileList(selectedMenuItem.path)
        store.setState('workspacePath', selectedMenuItem.path)
      } else {
        store.updateFileList(workspacePath)
      }

      setModalState({
        isShowCreateFileModal: false,
      })
    } catch (e) {
      message.warn('文件已存在')
    }
  }

  const removeDirInModal = async () => {
    const selectedMenuItem = selectedMenuItemRef.current
    if (!selectedMenuItem) return

    await fs.removeDir(selectedMenuItem.path, { recursive: true })
    refreshFileList()
    setModalState({
      isShowRemoveConfirmModal: false,
    })
  }

  const clickFile = async ({ children, path, name }: fs.FileEntry) => {
    if (!children) {
      // 文件
      openFile({ name, path })
      return
    }

    // 文件夹
    store.setState('workspacePath', path)
    await store.updateFileList(path)
  }

  const openFile = ({ name, path }: fs.FileEntry) => {
    if (!name || !path) return

    navigate('/editor', { state: { filePath: path, name } })
  }

  return (
    <>
      <div
        ref={listRef}
        className={`${styles.container} ${className}`}
        onClick={() => setMenuState({ isShow: false })}
        onContextMenu={(e) => {
          e.preventDefault()
          setMenuState({ isShow: true, x: e.clientX, y: e.clientY })
          selectedMenuItemRef.current = null
        }}
      >
        {fileList?.length > 0 ? (
          fileList.map((item) => (
            <div
              className={styles.listItem}
              key={item.path}
              onClick={() => {
                if (menuState.isShow) {
                  setMenuState({ isShow: false })
                  return
                }
                clickFile(item)
              }}
              onContextMenu={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setMenuState({ isShow: true, x: e.clientX, y: e.clientY })
                selectedMenuItemRef.current = item
              }}
            >
              <div className={styles.name}>
                {isEndsWithMd(item.name) ? (
                  <FileItem type='icon-file-markdown' name={item.name} />
                ) : isEndsWithTxt(item.name) ? (
                  <FileItem type='icon-wenbenwenjian_file-text' name={item.name} />
                ) : item?.children ? (
                  <FileItem type='icon-dakaiwenjianjia' name={item.name} />
                ) : (
                  <FileItem type='icon-wenjian' name={item.name} />
                )}
              </div>

              <div className={styles.lastModifyTime}>最后编辑时间：{item.create_time}</div>
            </div>
          ))
        ) : (
          <div className={styles.tip}>暂无内容</div>
        )}
      </div>

      <ContextMenu x={menuState.x} y={menuState.y} visible={menuState.isShow}>
        <CustomMenu menus={menus} />
      </ContextMenu>

      <CreateInputModal
        title='文件夹名称：'
        visible={modalState.isShowCreateDirModal}
        onOk={createDir}
        onCancel={() => setModalState({ isShowCreateDirModal: false })}
      />

      <CreateInputModal
        title='文件名称：'
        visible={modalState.isShowCreateFileModal}
        onOk={createFile}
        onCancel={() => setModalState({ isShowCreateFileModal: false })}
      />

      <RemoveConfirmModal
        visible={modalState.isShowRemoveConfirmModal}
        onOk={removeDirInModal}
        onCancel={() => setModalState({ isShowRemoveConfirmModal: false })}
      />
    </>
  )
}

export default observer(FlatList)
