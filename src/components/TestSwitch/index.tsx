import React from 'react';
import usePropsValue from '../../hooks/usePropsValue';
import './index.less'

const classPrefix = 'py-switch'
interface IProps {
  checked?: boolean;
  onChange?: (val: boolean) => void;
}
const Switch: React.FC<IProps> = (props) => {
  const [checked, setChecked] = usePropsValue<boolean>({
    ...props,
    value: props.checked,
    defaultValue: false
  })
  return (
    <>
    <div className={`${classPrefix}-container`}>
      <input checked={checked} onChange={(e) => {
        setChecked(e.target.checked)
      }} id="switchToggle" className={`${classPrefix}-toggle`} type="checkbox" />
      <label htmlFor="switchToggle" ></label>
    </div>
    </>
  );
};

export default Switch;
