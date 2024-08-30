import React from 'react';
import styles from "./BuyDollars.module.scss";
import Button from "../../ui/Button/Button";
import coinsImage from "../../img/market/coins.png";
import coinsManyImage from "../../img/market/coins-many.png";
import coinsBagImage from "../../img/market/coins-bag.png";
import coinsBigBagImage from "../../img/market/coins-big-bag.png";
import {buyUSD} from "../../http/market";
import {setUser} from "../../store/slice";
import {useDispatch} from "react-redux";

const BuyDollars = () => {
  const dispatch = useDispatch();

  const handleBuyUSD = async (amount) => {
    const data = await buyUSD(amount);
    dispatch(setUser(data.user));
  }

  return (
    <div className={styles.buyDollars}>
      <div className={styles.block}>
        <img src={coinsImage} width={75} alt={""}/>
        <p className={styles.value}>+100</p>
        <Button width={"100%"} onClick={() => handleBuyUSD(100)}>
          <span>0.99</span>
          <span className={styles.small}>USD</span>
        </Button>
      </div>
      <div className={styles.block}>
        <img src={coinsManyImage} width={75} alt={""}/>
        <p className={styles.value}>+330</p>
        <Button width={"100%"} onClick={() => handleBuyUSD(330)}>
          <span>2.99</span>
          <span className={styles.small}>USD</span>
        </Button>
      </div>
      <div className={styles.block}>
        <img src={coinsBagImage} width={75} alt={""}/>
        <p className={styles.value}>+690</p>
        <Button width={"100%"} onClick={() => handleBuyUSD(690)}>
          <span>5.99</span>
          <span className={styles.small}>USD</span>
        </Button>
      </div>
      <div className={styles.block}>
        <img src={coinsBigBagImage} width={75} alt={""}/>
        <p className={styles.value}>+1400</p>
        <Button width={"100%"} onClick={() => handleBuyUSD(1400)}>
          <span>9.99</span>
          <span className={styles.small}>USD</span>
        </Button>
      </div>
    </div>
  );
};

export default BuyDollars;