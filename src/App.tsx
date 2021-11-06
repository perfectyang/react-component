import React, {useRef} from 'react';
import Input from './components/Input'
import Toast from './components/Toast'
import Button from './components/Button';
import Son from './demo/Son';

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
  console.log('app-render')
  return (
    <>
      <div style={{padding: '10px'}}>
        <Button size="mini" color="warning" onClick={show2}>Toast2</Button>
      </div>
      <div style={{padding: '10px'}}>
        <Button size="middle" color="primary" onClick={show}>Toast</Button>
      </div>
      <div style={{padding: '10px'}}>
      <Button size="large" color="success" onClick={show2}>Toast2</Button>
      </div>
      <div style={{padding: '10px'}}>
        <Button block color="danger" onClick={openLoad} loading={loading} loadingText="loading">
          btn
        </Button>
        <Son value={'初始化'}  />
      </div>
    </>
  );
};

export default App;
