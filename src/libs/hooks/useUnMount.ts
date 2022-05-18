import React, { useEffect, useRef } from 'react'

export const useUnMount = (callback: () => any) => {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => () => callbackRef.current(), [])
}
