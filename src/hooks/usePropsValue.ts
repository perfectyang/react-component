import React from 'react'
import useUpdate from './useUpdate'

interface IOPtions<T> {
  value?: T;
  defaultValue: T;
  onChange?: (v: T) => void;
}

const usePropsValue = <T>(options: IOPtions<T>) => {
  const {value, defaultValue, onChange} = options
  const stateRef = React.useRef<T>(value !== undefined ? value : defaultValue)
  if (value !== undefined) {
    stateRef.current = value
  }
  const update = useUpdate()
  const setState = React.useCallback((v: T) => {
    if (value === undefined) {
      stateRef.current = v
      update()
    }
    onChange?.(v)
  }, [value, update, onChange])
  return [stateRef.current, setState] as const
}
export default usePropsValue