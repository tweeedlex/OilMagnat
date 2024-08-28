import React from 'react';
import Switch from "../../ui/Switch/Switch";
import Header from "../../components/Header/Header";
import SellOil from "../../components/SellOil/SellOil";
import BuyDollars from "../../components/BuyDollars/BuyDollars";

const Market = () => {
  const [page, setPage] = React.useState("sell");

  return (
    <div className={"page with-footer"}>
      <Header isVisible={page === "sell"} />
      <Switch
        defaultOptions={[{ text: "Sell Oil", callback: () => setPage("sell"), isActive: true }, { text: "Buy Oil Dollars", callback: () => setPage("buy") }]}
      />
      {
        page === "sell" ? <SellOil /> : <BuyDollars />
      }
    </div>
  );
};

export default Market;