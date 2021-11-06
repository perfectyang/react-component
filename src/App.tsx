import React from 'react';
import Son from './demo/Son';

interface IProps {}
const App: React.FC<IProps> = ({
}) => {
  return (
    <>
      <div style={{padding: '10px'}}>
        <Son value={'初始化'}  />
      </div>
    </>
  );
};

export default App;
