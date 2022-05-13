import Icon from '@/components/Icon'
import { useGlobalStore } from '@/store'
import { DownOutlined } from '@ant-design/icons'
import { fs } from '@tauri-apps/api'
import { Tree, TreeDataNode } from 'antd'
import { EventDataNode } from 'antd/lib/tree'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { FC, Key, memo, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './index.module.less'
import './reset.less'

interface IProps {
  fileList: fs.FileEntry[]
  style?: React.CSSProperties
  onClickFile?: (item: fs.FileEntry) => void
}

const TreeList: FC<IProps> = ({ fileList, style, onClickFile }) => {
  const store = useGlobalStore()
  const [expandedKeys, setExpandKeys] = useState<Key[]>([])

  const handleTreeData: (fileList: fs.FileEntry[]) => TreeDataNode[] = (fileList) => {
    return toJS(fileList).map((file) => {
      if (file.children) {
        return {
          icon: <Icon size={18} className='icon-dakaiwenjianjia' />,
          key: file.path,
          path: file.path,
          title: file.name,
          children: handleTreeData(file.children),
          onClick: () => {
            console.log(123123)
          },
        }
      } else {
        return {
          icon: <Icon size={18} className='icon-file-markdown' />,
          key: file.path,
          path: file.path,
          title: file.name,
        }
      }
    }) as TreeDataNode[]
  }

  const treeData = handleTreeData(fileList)

  return (
    <div className={`tree-list ${styles.tree}`} style={style}>
      <Tree
        showIcon
        blockNode
        switcherIcon={<DownOutlined />}
        autoExpandParent
        expandedKeys={expandedKeys}
        onExpand={(expandedKeys) => {
          setExpandKeys(expandedKeys)
        }}
        onSelect={([selectedKey], e) => {
          // if (expandKeys.includes(selectedKey)) {
          //   const _expandKeys = expandKeys
          //   _expandKeys.splice(_expandKeys.findIndex((item) => item === selectedKey))
          //   setExpandKeys([..._expandKeys])
          // } else {
          //   setExpandKeys([...expandKeys, selectedKey])
          // }
          if (!e.node?.children) {
            const file: fs.FileEntry = {
              path: (e.node as EventDataNode & { path: string }).path,
              name: e.node.title as string,
            }
            onClickFile?.(file)
          }
        }}
        onRightClick={(info) => {
          console.log(info.event)
        }}
        treeData={treeData}
      />
    </div>
  )
}

export default observer(TreeList)
