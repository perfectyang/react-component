import React from 'react';
import usePropsValue from '../../hooks/usePropsValue';
import { ListContext } from './Context';

export interface IList {
  value?: string[]
  multiple?: boolean
  onChange?: (val: string[]) => void
  defaultValue?: any | null
  disabled?: boolean
}
const List: React.FC<IList> = (props) => {
  const [value, setValue] = usePropsValue<string[]>({
    value: props.value,
    defaultValue: props.defaultValue ?? null,
    onChange: props.onChange
  })

  function check(val: string) {
    if (props.multiple) {
      setValue([...value, val])
    } else {
      setValue([val])
    }
  }

  function uncheck(val: string | string[]) {
    setValue(value.filter(item => item !== val))
  }

  const data = React.useMemo(() => ({
    value,
    check,
    uncheck,
    disabled: props.disabled ?? false,
    multiple: props.multiple ?? false,
  }), [value, props.multiple, props.disabled])

  return (
    <ListContext.Provider
      value={data}
    >
      {props.children}
    </ListContext.Provider>
  );
}

export default List