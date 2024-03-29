import React, { useEffect, useRef, useState } from "react";
import cs from "classnames";

import { DraggableItemProps, DragPosition, DragStatus } from "./interface";
const prefixCls = "draggable";

function Item(props: DraggableItemProps) {
  const {
    style,
    children,
    direction,
    disabled,
    droppable = true,
    onDrop,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDragLeave,
  } = props;
  const refItem = useRef<HTMLLIElement>(null);
  const refDraggedTimer = useRef(null);

  const [dragStatus, setDragStatus] = useState<DragStatus>("none");
  const [dragOver, setDragOver] = useState(false);
  const [dragPosition, setDragPosition] = useState<DragPosition>(null);

  useEffect(() => {
    return () => {
      refDraggedTimer.current && clearTimeout(refDraggedTimer.current);
    };
  }, []);

  useEffect(() => {
    if (dragStatus === "dragged") {
      refDraggedTimer.current = setTimeout(() => setDragStatus("none"), 1000);
    }
  }, [dragStatus]);

  return (
    <li
      draggable
      ref={refItem}
      style={style}
      className={cs(`draggable-item`, {
        [`draggable-item-${dragStatus}`]: dragStatus !== "none",
        [`draggable-item-gap-${dragPosition}`]: dragPosition,
        [`draggable-item-disabled`]: disabled,
        [`draggable-item-dragover`]: dragOver,
      })}
      onDragStart={(event) => {
        event.stopPropagation();
        setDragStatus("dragging");

        try {
          // ie throw error
          // firefox-need-it
          event.dataTransfer.setData("text/plain", "");
        } catch (error) {}

        onDragStart && onDragStart(event);
      }}
      onDragEnd={(event) => {
        event.stopPropagation();
        setDragOver(false);
        setDragStatus("dragged");
        onDragEnd && onDragEnd(event);
      }}
      onDragOver={(event) => {
        if (droppable) {
          event.stopPropagation();
          event.preventDefault();

          const rect = refItem.current.getBoundingClientRect();

          if (direction === "vertical") {
            setDragPosition(
              event.pageY > window.pageYOffset + rect.top + rect.height / 2
                ? "bottom"
                : "top",
            );
          } else {
            setDragPosition(
              event.pageX > window.pageXOffset + rect.left + rect.width / 2
                ? "right"
                : "left",
            );
          }
          setDragOver(true);
          onDragOver && onDragOver(event);
        }
      }}
      onDragLeave={(event) => {
        if (droppable) {
          event.stopPropagation();
          setDragOver(false);
          onDragLeave && onDragLeave(event);
        }
      }}
      onDrop={(event) => {
        if (droppable) {
          event.stopPropagation();
          event.preventDefault();
          setDragOver(false);
          setDragPosition(null);
          setDragStatus("none");
          console.log("dragPosition", dragPosition);
          onDrop && onDrop(event, dragPosition);
        }
      }}
    >
      {children}
    </li>
  );
}

export default Item;
