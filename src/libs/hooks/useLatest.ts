import React, { useRef } from 'react'

export const useLatest = <T>(value: T): [T, (value: T) => void] => {
  const ref = useRef(value)

  const setCurrent = (value: T): void => {
    ref.current = value
  }

  return [ref.current, setCurrent]
}
