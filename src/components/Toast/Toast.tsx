import React, {FC, useState, useEffect, useCallback} from 'react';
import Mask from '../Mask';
import './Toast.less'
interface IProps {
  content: string;
  visible: boolean;
  onClose?: () => void;
  duration?: number;
}

const Toast: FC<IProps> = ({
  visible,
  onClose,
  content,
  duration = 9000
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
  const setHide = useCallback(() => setShow(false), [])
  return (
    <Mask visible={show} onMaskClick={ setHide }><div className="Toast-content">{content}</div></Mask>
  )
}


export default Toast;
