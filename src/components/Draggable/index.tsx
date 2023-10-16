import React, { useContext, useState } from "react";
import Item from "./item";
import { DraggableProps } from "./interface";
import { classNames as cs } from "@util";
import "./index.less";

const moveItem = (arr, fromIndex, toIndex) => {
  arr = arr.slice();
  const isMoveLeft = fromIndex > toIndex;
  const [item] = arr.splice(fromIndex, 1);
  arr.splice(isMoveLeft ? toIndex : toIndex - 1, 0, item);
  return arr;
};

const exchangeItem = (arr, fromIndex, toIndex) => {
  const array = arr.slice();
  const temp = arr[fromIndex];
  array[fromIndex] = array[toIndex];
  array[toIndex] = temp;
  return array;
};

export default function Draggable(props: DraggableProps) {
  const {
    className,
    children,
    direction = "vertical",
    itemWrapperStyle,
    value,
    onChange,
    type = "sort",
  } = props;

  const [dragItemIndex, setDragItemIndex] = useState(null);

  return (
    <div
      className={cs(`draggable direction direction-${direction}`, className)}
    >
      {React.Children.map(children, (child, index) => {
        return (
          <Item
            style={itemWrapperStyle}
            direction={direction}
            onDragStart={() => setDragItemIndex(index)}
            onDragEnd={() => setDragItemIndex(null)}
            onDrop={(_, dropPosition) => {
              const prevIndex = dragItemIndex;
              const nextIndex =
                type === "sort"
                  ? dropPosition === "left" || dropPosition === "top"
                    ? index
                    : index + 1
                  : index;

              if (prevIndex !== nextIndex) {
                if (type === "sort") {
                  onChange?.(
                    moveItem(value, prevIndex, nextIndex),
                    nextIndex,
                    prevIndex
                  );
                } else if (type === "exchange") {
                  onChange?.(
                    exchangeItem(value, prevIndex, nextIndex),
                    nextIndex,
                    prevIndex
                  );
                }
              }
            }}
          >
            {child}
          </Item>
        );
      })}
    </div>
  );
}
