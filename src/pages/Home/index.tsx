import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './index.module.css'

function Home() {
  return (
    <div className={styles.container}>
      <Link to='/setting'>设置</Link>
    </div>
  )
}

export default Home
