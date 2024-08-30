import React, {useEffect, useState} from 'react';
import Button from "../../ui/Button/Button";
import styles from "./SellOil.module.scss";
import {changeOil, getCurrency} from "../../http/market";
import {useDispatch} from "react-redux";
import {setUser} from "../../store/slice";

const SellOil = () => {
  const [currency, setCurrency] = useState(0);
  const [oilAmount, setOilAmount] = useState(0);
  const [usdAmount, setUsdAmount] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    getCurrency().then(data => {
      setCurrency(parseFloat((1 / data.currency).toFixed(4)));
    });
  }, []);

  useEffect(() => {
    setUsdAmount(parseFloat((oilAmount * currency).toFixed(2)));
  }, [oilAmount, currency]);

  const handleSell = async () => {
    const response = await changeOil(Number(oilAmount));

    if (response.error) {
      return alert(response.error.response.data.message);
    }

    setOilAmount(0);
    dispatch(setUser(response.data.user));
    alert("Oil sold successfully");
  }

  return (
    <div className={styles.market}>
      <div className={styles.prices}>
        <div className={styles.left}>
          <p className={styles.currency}>BBL</p>
          <input className={styles.priceInput} value={oilAmount} onChange={(e) => setOilAmount(e.target.value)} type={"number"}/>
          <p className={styles.available}><span>Available:</span> 10000 BBL</p>
        </div>
        <div className={styles.right}>
          <p className={styles.currency}>USD</p>
          <p className={styles.price}>{usdAmount}</p>
          <p className={styles.available}><span>Available:</span> 10000 USD</p>
        </div>
      </div>
      <hr/>
      <div className={styles.submit}>
        <p>1 Barrel ≈ {currency} USD</p>
        <Button onClick={handleSell} width={"100%"}>Sell</Button>
      </div>
    </div>
  );
};

export default SellOil;