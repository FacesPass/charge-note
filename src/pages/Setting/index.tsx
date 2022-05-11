import React from 'react'
import { Link } from 'react-router-dom'
import styles from './index.module.less'

function Setting() {
  return (
    <div className={styles.container}>
      <Link to='/'>返回</Link>
    </div>
  )
}

export default Setting
