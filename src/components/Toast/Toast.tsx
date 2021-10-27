import React, {FC, useState, useEffect} from 'react';
import {createPortal} from 'react-dom'
interface IProps {
  content: string;
  visible: boolean;
  onClose?: () => void;
  duration?: number;
}
interface IDialog {
  content: string;
}

const Dialog: FC<IDialog> = React.memo((props) => {
  const {content} = props
  return <h1>{content}</h1>
})



const Toast: React.FC<IProps> = ({
  visible,
  onClose,
  content,
  duration = 1000
}) => {
  const [show, setShow] = useState(visible)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
    }, duration)
    return () => {
      clearTimeout(timer)
      onClose?.()
    }
  }, [])


  return show ? createPortal(<Dialog content={content} />, document.body) : null
};

export default Toast;
