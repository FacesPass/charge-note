import React, { useEffect } from 'react'
import FlatList from './components/FlatList'
import { observer } from 'mobx-react-lite'
import { useGlobalStore } from '@/store'
import PathTracing from './components/PathTracing'
import { tracingHeightLayout } from '@/libs/dom'

function Home() {
  const store = useGlobalStore()
  const storeFileList = store.getState('fileList')

  useEffect(() => {
    setTimeout(() => {
      tracingHeightLayout()
    }, 0)
  }, [storeFileList])

  return (
    <>
      <PathTracing className='path-tracing' />
      <FlatList className='file-list' fileList={storeFileList} />
    </>
  )
}

export default observer(Home)
