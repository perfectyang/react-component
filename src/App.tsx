import React from "react";
// import Son from './demo/Son';
// import TestControll from "./demo/TestControll";
// import TestControll from "./demo/TableDemo";
import EllipsisText from "./components/EllipsisText";

interface IProps {}
const App: React.FC<IProps> = ({}) => {
  return (
    <>
      <div style={{ padding: "10px" }}>
        {/* <Son value={'初始化'}  /> */}
        <div style={{ width: "90px", border: "1px solid red" }}>
          <EllipsisText text="我是一个测试文本" buttonText="out" />
        </div>
      </div>
    </>
  );
};

export default App;
