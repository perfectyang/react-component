import React from 'react';
import styles from './index.less';

interface IProps {}
const Test: React.FC<IProps> = ({
}) => {

  return (
    <>
      <h1>Test</h1>
      <div className={styles.box}>
        <div className={styles.boxItemLeft}></div>
        <div className={style.boxItemRight}></div>
      </div>
      <div className={style.header}></div>
      <div className={style.description}></div>
    </>
  );
};

export default Test;
