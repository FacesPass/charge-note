import React, { FC, useEffect, useState } from 'react'
import { indexOfStr, splitPath } from '@/libs/utils/path'
import { useGlobalStore } from '@/store'
import { observer } from 'mobx-react-lite'
import styles from './index.module.less'

interface IProps {
  className?: string
}

const PathTracing: FC<IProps> = ({ className }) => {
  const store = useGlobalStore()
  const workspacePath = store.getState('workspacePath')
  const [followRootPaths, setFollowRootPaths] = useState<string[]>([])

  useEffect(() => {
    handlePathTracing()
  }, [workspacePath])

  const clickPathTrace = async (path: string, index: number) => {
    if (!workspacePath) return
    // 处理有相同名称的子目录的情况
    const strPositions = indexOfStr(workspacePath, path)
    let pos
    if (strPositions.length > 1) {
      pos = strPositions[index - 1]
    } else {
      pos = strPositions[0]
    }
    const pathToJump = workspacePath.slice(0, pos + path.length)
    await store.updateFileList(pathToJump)
    store.setState('workspacePath', pathToJump)
  }

  const handlePathTracing = () => {
    if (!workspacePath) return
    const rootPath = store.getState('workspaceRoot')
    const paths = splitPath(workspacePath)
    const followRootPaths = paths.slice(paths.findIndex((path) => rootPath === path))
    setFollowRootPaths(followRootPaths)
  }

  return (
    <div className={`${styles.container} ${className}`}>
      {followRootPaths.map((path, index) => (
        <span key={index}>
          {index === 0 && <span>{'~'}</span>}
          <span className={styles.path} onClick={() => clickPathTrace(path, index)}>
            {path}
          </span>
          {index !== followRootPaths.length - 1 && <span>{' > '}</span>}
        </span>
      ))}
    </div>
  )
}

export default observer(PathTracing)
