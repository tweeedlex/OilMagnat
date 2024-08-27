import React from 'react';
import styles from "./Preloader.module.scss";

const Preloader = () => {
  return (
    <div className={styles.preloader}>
      <div className={styles.loader}>
        <div className={styles.loaderInner}></div>
      </div>
    </div>
  );
}

export default Preloader;