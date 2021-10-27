import React, {useRef} from 'react';
import Input from './components/Input'
import Toast from './components/Toast'
import Button from './components/Button';

interface IProps {}
const App: React.FC<IProps> = ({
}) => {
  const myRef = useRef<HTMLInputElement>(null)
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
  return (
    <>
      <Input placeholder="hello" ref={myRef}  clearable />
      <Button onClick={show2}>Toast2</Button>
      <Button onClick={show}>Toast</Button>
      <Button onClick={openLoad} loading={loading} loadingText="loading">
        btn
      </Button>
    </>
  );
};

export default App;
