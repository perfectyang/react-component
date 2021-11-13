import React from 'react';
import usePropsValue from '../../hooks/usePropsValue';
import { useListContext } from './Context';

export interface IListItem {
  disabled?: boolean
  value?: any
}
const ListItem: React.FC<IListItem> = (props) => {
  const context = useListContext()
  const { value, disabled } = props
  const active = context?.value.includes(props.value)
  return (
    <>
    <div className="ListItem" onClick={(e) => {
      if (!disabled) {
        if (active) {
          if (context?.multiple) {
            context?.uncheck(value)
          }
        } else {
          context?.check(value)
        }
      }
      e.stopPropagation()
    }}>
      {active ? '选中' : '未选中'}
      <div className="ListItemContent">
        {props.children}
      </div>
    </div>
    </>
  );
};

export default ListItem;
