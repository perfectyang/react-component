import React from 'react';

import usePropsValue from './hooks/usePropsValue';
import { ListContext } from './Context';

export interface IList<T> {
  value?: T[];
  multiple?: boolean;
  cancelSelect?: boolean;
  onChange?: (val: T[]) => void;
  defaultValue?: any | null;
  // disabled?: boolean;
  children?: React.ReactNode;
}
function List<T>(props: IList<T>) {
  const [value, setValue] = usePropsValue<T[]>({
    value: props.value,
    defaultValue: props.defaultValue ?? null,
    onChange: props.onChange,
  });

  const check = React.useCallback(
    (val: T) => {
      if (props.multiple) {
        setValue([...value, val]);
      } else {
        setValue([val]);
      }
    },
    [value, props.multiple]
  );
  const uncheck = React.useCallback(
    (val: T) => {
      setValue(value.filter((item) => item !== val));
    },
    [value]
  );

  const data = React.useMemo(
    () => ({
      value,
      check,
      uncheck,
      // disabled: props.disabled ?? false,
      multiple: props.multiple ?? false,
      cancelSelect: props.cancelSelect ?? false,
    }),
    [value, check, uncheck, props.multiple]
  );

  return (
    <ListContext.Provider value={data}>{props.children}</ListContext.Provider>
  );
}

export default List;
