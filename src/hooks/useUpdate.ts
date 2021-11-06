import React from 'react'

const useUpdate = () => {
  const [, setState] = React.useState({})
  return React.useCallback(
    () => {
      console.log('update---')
      setState({})
    },
    [],
  )
}
export default useUpdate 