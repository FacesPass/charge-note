import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import { isEndsWithMd, isEndsWithTxt, isLegalFile } from '@/libs/utils/file'
import { fs, shell } from '@tauri-apps/api'
import styles from './index.module.less'
import ContextMenu from '@/components/ContextMenu'
import { IFsOutput } from '@/libs/backend/type'
import CustomMenu, { IMenuItem } from './components/CustomMenu'
import { copy } from '@/libs/utils/command'
import { message } from 'antd'
import FileItem from './components/FileItem'
import { useGlobalStore } from '@/store'
import { useNavigate } from 'react-router-dom'
import { modalStorage, ModalStorageState } from '@/libs/storage/modalStorage'
import { observer } from 'mobx-react-lite'
import CreateInputModal from './components/CreateInputModal'
import RemoveConfirmModal from './components/RemoveConfirmModal'
import { useLatest, useMount, useSetState, useUnMount } from '@/libs/hooks'

interface IProps {
  className?: string
  fileList: IFsOutput[]
}

const FlatList: FC<IProps> = ({ fileList, className }) => {
  const store = useGlobalStore()
  const navigate = useNavigate()
  const listRef = useRef<HTMLDivElement | null>(null)
  const [isShowMenu, setIsShowMenu] = useState(false)
  const [modalState, setModalState] = useSetState({
    isShowCreateFileModal: false,
    isShowCreateDirModal: false,
    isShowRemoveConfirmModal: false,
  })
  const [menuLayout, setMenuLayout] = useState({ x: 0, y: 0 })
  const [selectedMenuItem, setSelectedMenuItem] = useLatest<IFsOutput | null>(null)

  useEffect(() => {
    closeMenu()
  }, [fileList])

  useMount(() => listRef.current?.addEventListener('scroll', closeMenu))
  useUnMount(() => listRef.current?.removeEventListener('scroll', closeMenu))

  const itemMenus: IMenuItem[] = useMemo(
    () => [
      {
        label: '新建文件',
        key: 'newFile',
        isShow: !!selectedMenuItem?.children,
        onClick: () => {
          closeMenu()
          setModalState({
            ...modalState,
            isShowCreateFileModal: true,
          })
        },
      },
      {
        label: '新建文件夹',
        key: 'newDir',
        isShow: !!selectedMenuItem?.children,
        onClick: () => {
          if (!selectedMenuItem) return
          closeMenu()
          setModalState({
            ...modalState,
            isShowCreateDirModal: true,
          })
        },
      },
      {
        label: '打开所在位置',
        key: 'openInExplorer',
        onClick: async () => {
          try {
            console.log('selectedMenuItem', selectedMenuItem)
            if (!selectedMenuItem) return
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
        onClick: async () => {
          try {
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
        label: '删除',
        key: 'remove',
        onClick: async () => {
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
                ...modalState,
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
    [selectedMenuItem],
  )

  const closeMenu = () => {
    setIsShowMenu(false)
  }

  const refreshFileList = () => {
    const workspacePath = store.getState('workspacePath')
    if (!workspacePath) return
    store.updateFileList(workspacePath)
  }

  const createDir = async (inputVal: string) => {
    if (!selectedMenuItem) return
    try {
      const pathToCreate = `${selectedMenuItem.path}\\${inputVal}`
      await fs.createDir(pathToCreate)
      store.updateFileList(pathToCreate)
      store.setState('workspacePath', pathToCreate)
      setModalState({
        ...modalState,
        isShowCreateDirModal: false,
      })
    } catch (e) {
      message.warn('文件夹已存在')
    }
  }

  const createFile = async (inputVal: string) => {
    if (!selectedMenuItem) return
    try {
      const pathToCreate = `${selectedMenuItem.path}\\${inputVal}.md`
      await fs.writeFile({ path: pathToCreate, contents: '' })
      store.updateFileList(selectedMenuItem.path)
      store.setState('workspacePath', selectedMenuItem.path)
      setModalState({
        ...modalState,
        isShowCreateFileModal: false,
      })
    } catch (e) {
      message.warn('文件已存在')
    }
  }

  const removeDirInModal = async () => {
    if (!selectedMenuItem) return

    await fs.removeDir(selectedMenuItem.path, { recursive: true })
    refreshFileList()
    setModalState({
      ...modalState,
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

    navigate('/editor', { state: { path, name, isNew: false } })
  }

  const handleFileListSequense = (fileList: IFsOutput[]) => [
    ...fileList.filter((item) => isLegalFile(item.name)),
    ...fileList.filter((item) => item.children),
  ]

  return (
    <>
      <div
        ref={listRef}
        className={`${styles.container} ${className}`}
        onClick={() => setIsShowMenu(false)}
      >
        {handleFileListSequense(fileList).length > 0 ? (
          handleFileListSequense(fileList)?.map((item) => (
            <div
              className={styles.listItem}
              key={item.path}
              onClick={() => {
                if (isShowMenu) {
                  setIsShowMenu(false)
                  return
                }
                clickFile(item)
              }}
              onContextMenu={(e) => {
                e.preventDefault()
                setIsShowMenu(true)
                setMenuLayout({ x: e.clientX, y: e.clientY })
                setSelectedMenuItem(item)
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

      <ContextMenu x={menuLayout.x} y={menuLayout.y} visible={isShowMenu}>
        <CustomMenu menus={itemMenus} />
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
