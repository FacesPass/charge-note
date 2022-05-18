import React, { useState } from 'react'

export const useSetState = <T extends object>(initialState: T | (() => T)) => {
  const [state, setState] = useState<T>(initialState)

  const set = (value: Partial<T> | ((preState: T) => T)): void => {
    setState({
      ...state,
      ...(value instanceof Function ? value(state) : value),
    })
  }

  return [state, set] as const
}
