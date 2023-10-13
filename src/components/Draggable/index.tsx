import React, { useContext, useState } from "react";
import cs from "classnames";
import Item from "./item";
import { DraggableProps } from "./interface";
import "./index.less";

export default function Draggable(props: DraggableProps) {
  const {
    className,
    children,
    direction = "vertical",
    onIndexChange,
    itemWrapperStyle,
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
                dropPosition === "left" || dropPosition === "top"
                  ? index
                  : index + 1;
              if (onIndexChange && prevIndex !== nextIndex) {
                onIndexChange(nextIndex, prevIndex);
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
