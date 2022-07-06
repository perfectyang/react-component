import React from "react";

const useUpdate = () => {
  const [_, forceUpdate] = React.useReducer((x) => x + 1, 0);
  return React.useCallback(() => {
    forceUpdate();
  }, []);
};
export default useUpdate;
