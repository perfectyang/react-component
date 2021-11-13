import React from 'react';
import Button from '../components/Button';
import Dialog from '../components/Dialog/index';
import Input from '../components/Input'
import Switch from '../components/Switch/index';
import TestSwitch from '../components/TestSwitch';
import Toast from '../components/Toast'
import Block from './Block/Block';
import DemoInfiniteScroll from '../demo/DemoInfiniteScroll'

interface IProps {
  value?: string
}
const Son: React.FC<IProps> = (props) => {
  const [value, setValue] = React.useState(props.value ?? '')
  const myRef = React.useRef<HTMLInputElement>(null)
  const show = () => {
    console.log()
    myRef.current?.focus()
    Toast({
      content: '在这里'
    })
  }
  const show2 = () => {
    Toast({
      content: '在这里2'
    })
  }

  const openLoad = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }
  const [loading, setLoading] = React.useState(false)

  const [checked, setChecked] = React.useState(false)

  const [n, setn] = React.useState(0)

  React.useEffect(() => {
    setTimeout(() => {
      setn(n => n + 1)
    }, 500)
  }, [])

  return (
    <>
      {/* <Block>
        <Button size="mini" color="warning" onClick={show2}>Toast2</Button>
      </Block>
      <Block>
        <Button block size="middle" color="primary" onClick={show}>Toast</Button>
      </Block>
      <Block>
        <Button size="large" color="success" onClick={show2}>Toast2</Button>
      </Block>
      <Block>
        <Input placeholder='请输入内容' type='password' value={value} onChange={(v) => {
          setValue(v)
        }} 
        clearable 
        />
      </Block>
      <Block>
        <Button color="danger" onClick={() => {
          Dialog.show({
            onClose: () => {
              console.log('close')
            }
          })
        }}>dialog</Button>
      </Block>

      <Block>
        <Switch checkedText="中文中言语主" uncheckedText="不可以不可以" loading={loading} checked={checked} onChange={(val) => {
          setLoading(true)
          setTimeout(() => {
            setLoading(false)
            setChecked(val)
          }, 2000)
        }} />
      </Block>
      <Block>
        <TestSwitch checked={checked} onChange={(val) => {
          setChecked(val)
        }} />
      </Block> */}
      {n}
      <button onClick={() => {
        setn(n => n + 1)
      }}>addN</button>
      <DemoInfiniteScroll fn={() => {
        console.log('aa')
        setn(n => n+1)
        setTimeout(() => {
          setn(n => n+1)
        }, 600)
      }} />
    </>
  );
};

export default Son;
