import React, { createRef, forwardRef } from "react";
import Dialog from "./Dialog";
import { renderToBody } from "../../hooks/renderToBody";

export type DialogShowRef = {
  close?: () => void
}
export interface IDialogShowProps {
  onClose?: () => void;
  afterClose?: () => void;
}

export function show(props: IDialogShowProps) {
  const Wrapper = forwardRef<DialogShowRef>((_, ref) => {
    const [visible, setVisible] = React.useState(false)
    React.useEffect(() => {
      setVisible(true)
    }, [])
    const handleClose = () => {
        props.onClose?.()
        setVisible(false)
    }
    React.useImperativeHandle(ref, () => ({
      close: handleClose
    }))
    return(
      <Dialog
       {...props}
       visible={visible}
       onClose={handleClose}
       afterClose={() => {
         props.afterClose?.()
         unMount()
       }}
      />
    )
  })
  const ref = createRef<DialogShowRef>()
  const unMount = renderToBody(<Wrapper ref={ref} />)
  return {
    close: () => {
      ref.current?.close?.()
    }
  } 
}