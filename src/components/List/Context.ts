import { createContext, useContext } from 'react';

export const ListContext = createContext<{
  value: any[];
  // disabled: boolean;
  check: (val: any) => void;
  uncheck: (val: any) => void;
  multiple: boolean;
  cancelSelect: boolean;
} | null>(null);

export const useListContext = () => {
  return useContext(ListContext);
};
