import React from 'react';
import Button from '../Button';
import Mask from '../Mask';

interface IProps {
  visible: boolean;
  afterClose?: () => void;
  onClose?: () => void;
  closeOnMaskClick?: boolean;
}
const defaultProps = {
  closeOnMaskClick: false
}
const classPrefix = 'py-dialog'

const Dialog: React.FC<IProps> = (p) => {
  const props = Object.assign(defaultProps, p)
  return (
    <Mask
      visible={props.visible}
      afterClose={props.afterClose}
      onMaskClick={props.closeOnMaskClick ? props.onClose : undefined}
    >
      <div className={`${classPrefix}-body`}>
        dialog-content
      </div>
      <div className={`${classPrefix}-footer`}>
        <Button onClick={props.onClose}>x</Button>
      </div>
    </Mask>
  );
};

export default Dialog;
