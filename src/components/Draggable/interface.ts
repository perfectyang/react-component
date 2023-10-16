import { CSSProperties, ReactNode } from "react";

export type DragStatus = "none" | "dragged" | "dragging";

export type DragPosition = "left" | "right" | "top" | "bottom";

export interface DraggableItemProps extends Pick<DraggableProps, "direction"> {
  style?: CSSProperties;
  children?: ReactNode;
  /** Weather allow to drag  */
  disabled?: boolean;
  /** Weather allow to drop on it */
  droppable?: boolean;
  onDragStart?: (event) => void;
  onDragEnd?: (event) => void;
  onDragLeave?: (event) => void;
  onDragOver?: (event) => void;
  onDrop?: (event, dropPosition: DragPosition) => void;
}

export interface DraggableProps {
  children?: ReactNode;
  direction?: "horizontal" | "vertical";
  type?: "sort" | "exchange"; // 排序或交互位置
  className?: string | string[];
  itemWrapperStyle?: CSSProperties;
  onChange: (value: any[], index: number, prevIndex: number) => void;
  value: any[];
}
