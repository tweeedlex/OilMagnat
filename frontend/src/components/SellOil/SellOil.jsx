import React, {useEffect, useState} from 'react';
import Button from "../../ui/Button/Button";
import styles from "./SellOil.module.scss";
import {changeOil, getMarketInfo} from "../../http/market";
import {useDispatch} from "react-redux";
import {setUser} from "../../store/slice";

const toFloat = (value) => parseFloat(value.toFixed(2));

const SellOil = () => {
  const [currency, setCurrency] = useState(0);
  const [oilAmount, setOilAmount] = useState(0);
  const [usdAmount, setUsdAmount] = useState(0);
  const [availableOil, setAvailableOil] = useState(0);
  const [availableUsd, setAvailableUsd] = useState(0);
  const [tradeOilTax, setTradeOilTax] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    getMarketInfo().then(data => {
      setCurrency(parseFloat((1 / data.currency).toFixed(4)));
      setAvailableOil(toFloat(data.availableOil));
      setAvailableUsd(toFloat(data.availableUSD));
      setTradeOilTax(toFloat(data.tradeOilTax));
    });
  }, []);

  useEffect(() => {
    setUsdAmount(parseFloat(((oilAmount * currency) - (oilAmount * currency * tradeOilTax / 100)).toFixed(2)));
  }, [oilAmount, currency]);

  const handleSell = async () => {
    const response = await changeOil(Number(oilAmount));

    if (response.error) {
      return alert(response.error.response.data.message);
    }

    setOilAmount(0);
    console.log(response)
    dispatch(setUser(response.user));
    alert("Oil sold successfully");
  }

  return (
    <div className={styles.market}>
      <div className={styles.prices}>
        <div className={styles.left}>
          <p className={styles.currency}>BBL</p>
          <input className={styles.priceInput} value={oilAmount} onChange={(e) => setOilAmount(e.target.value)} type={"number"}/>
          <p className={styles.available}><span>Available:</span> {availableOil} BBL</p>
        </div>
        <div className={styles.right}>
          <p className={styles.currency}>USD</p>
          <p className={styles.price}>{usdAmount}</p>
          <p className={styles.available}><span>Available:</span> {availableUsd} USD</p>
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