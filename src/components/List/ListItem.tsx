import { usePersistFn } from 'ahooks';
import React from 'react';

import { useListContext } from './Context';

export interface IListItem {
  disabled?: boolean;
  value?: any;
  children: (val: boolean | undefined, fn: any) => React.ReactNode;
}
const ListItem: React.FC<IListItem> = (props) => {
  const context = useListContext();
  const { value, disabled } = props;
  const active = context?.value.includes(props.value);
  const fn = usePersistFn((e) => {
    if (!disabled) {
      if (active) {
        if (context?.multiple || context?.cancelSelect) {
          context?.uncheck(value);
        }
      } else {
        context?.check(value);
      }
    }
    e.stopPropagation();
  });

  return <>{props.children(active, fn)}</>;
};

export default React.memo(ListItem);
