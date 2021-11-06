import React from 'react';
import './index.less'

interface IProps {}
const Block: React.FC<IProps> = (props) => {
  return (
    <div className="block">
      {props.children}
    </div>
  );
};

export default Block;
