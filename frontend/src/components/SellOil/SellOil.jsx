import React from 'react';
import Button from "../../ui/Button/Button";
import styles from "./SellOil.module.scss";

const SellOil = () => {
  return (
    <div className={styles.market}>
      <div className={styles.prices}>
        <div className={styles.left}>
          <p className={styles.currency}>BBL</p>
          <input className={styles.priceInput} value={2300} readOnly={true} type={"number"}/>
          <p className={styles.available}><span>Available:</span> 10000 BBL</p>
        </div>
        <div className={styles.right}>
          <p className={styles.currency}>USD</p>
          <p className={styles.price}>300</p>
          <p className={styles.available}><span>Available:</span> 10000 USD</p>
        </div>
      </div>
      <hr/>
      <div className={styles.submit}>
        <p>1 Barrel ≈ 0.032USD</p>
        <Button width={"100%"}>Sell</Button>
      </div>
    </div>
  );
};

export default SellOil;