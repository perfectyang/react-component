import React from 'react'

const useUpdate = () => {
  const [, setState] = React.useState({})
  return React.useCallback(
    () => {
      setState({})
    },
    [],
  )
}
export default useUpdate 