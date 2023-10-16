import { useMemo, useState } from "react";
import Draggable from ".";
import "./demo.less";

interface IProps {}
const Demo: React.FC<IProps> = (props) => {
  const [list, setList] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const renderList = useMemo(() => {
    return list.map((cur, idx) => {
      return (
        <div className="box" key={cur}>
          {cur}
        </div>
      );
    });
  }, [list]);
  return (
    <Draggable
      itemWrapperStyle={{ display: "inline-block" }}
      direction="horizontal"
      value={list}
      onChange={(value, index, prevIndex) => {
        // console.log("index, prevIndex", index, prevIndex);
        setList(value);
      }}
    >
      {renderList}
    </Draggable>
  );
};
export default Demo;
