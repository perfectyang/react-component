import React from "react";
// import Son from './demo/Son';
import TestControll from "./demo/TestControll";

interface IProps {}
const App: React.FC<IProps> = ({}) => {
  return (
    <>
      <div style={{ padding: "10px" }}>
        {/* <Son value={'初始化'}  /> */}
        <TestControll />
      </div>
    </>
  );
};

export default App;
