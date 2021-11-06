import React from 'react';
import Button from '../components/Button';
import Dialog from '../components/Dialog/index';
import Input from '../components/Input';

interface IProps {
  value?: string
}
const Son: React.FC<IProps> = (props) => {
  const [value, setValue] = React.useState(props.value ?? '')
  return (
    <>
      <h1>input</h1>
      {value}
      <Input placeholder='请输入内容' type='password' value={value} onChange={(v) => {
        console.log('va', v)
        setValue(v)
      }} 
      clearable 
      />
      ---------------------------------------------------------------------------------
      <Button color="danger" onClick={() => {
        Dialog.show({
          onClose: () => {
            console.log('close')
          }
        })
      }}>dialog</Button>

    </>
  );
};

export default Son;
