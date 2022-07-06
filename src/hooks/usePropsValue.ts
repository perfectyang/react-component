import React, { SetStateAction } from "react";
import useUpdate from "./useUpdate";

interface IOPtions<T> {
  value?: T;
  defaultValue: T;
  onChange?: (v: T) => void;
}

const usePropsValue = <T>(options: IOPtions<T>) => {
  const { value, defaultValue, onChange } = options;
  console.log("defaultValue", defaultValue);
  const isControlled = value !== undefined;
  const stateRef = React.useRef<T>(isControlled ? value : defaultValue);
  if (isControlled) {
    stateRef.current = value;
  }
  const update = useUpdate();
  const setState = React.useCallback(
    (v: SetStateAction<T>, forceUpdate: Boolean = false) => {
      const nextState =
        typeof v === "function"
          ? (v as (preState: T) => any)(stateRef.current)
          : v;
      if (!forceUpdate && nextState === stateRef.current) return;
      stateRef.current = nextState;
      update();
      onChange?.(nextState);
    },
    [value, update, onChange]
  );
  return [stateRef.current, setState] as const;
};
export default usePropsValue;
