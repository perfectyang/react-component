import { useMemo, useState } from "react";
import Draggable from ".";
import "./demo.less";

const moveItem = function (arr, fromIndex, toIndex) {
  arr = arr.slice();
  const isMoveLeft = fromIndex > toIndex;
  const [item] = arr.splice(fromIndex, 1);
  arr.splice(isMoveLeft ? toIndex : toIndex - 1, 0, item);
  return arr;
};

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
      onIndexChange={(index, prevIndex) => {
        // console.log("index, prevIndex", index, prevIndex);
        setList((prevList) => {
          const newList = moveItem(prevList, prevIndex, index);
          return [...newList];
        });
      }}
    >
      {renderList}
    </Draggable>
  );
};
export default Demo;
