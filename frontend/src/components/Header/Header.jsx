import React, {useEffect, useState} from 'react';
import styles from "./Header.module.scss";
import bblIcon from "../../img/main/bbl.png";
import dollarIcon from "../../img/main/dollar.png";
import {useSelector} from "react-redux";

const Header = ({isVisible = true}) => {
  const user = useSelector(state => state.user);

  return (
    <div className={styles.info} style={{display: (isVisible ? "flex" : "none")}}>
      <div className={styles.infoSide}>
        <img src={bblIcon} width={32} alt={""}/>
        <p>{user.oilAmount} <span>BBL</span></p>
      </div>
      <svg width="0" height="0">
        <defs>
          <clipPath id="roundedPolygon" clipPathUnits="objectBoundingBox">
            <polygon points="0 0, 1 0.01, 0.8 1, 0.2 1.01"/>
          </clipPath>
        </defs>
      </svg>
      <div className={styles.oilStorage}>
        <div className={styles.fill} style={{height: `${user.notClaimedOil / user.maxOilAmount * 100}%`}}></div>
        <p className={styles.oilAmount}>{user.notClaimedOil}</p>
      </div>
      <div className={[styles.infoSide, styles.right].join(" ")}>
        <img src={dollarIcon} width={32} alt={""}/>
        <p>{user.balance?.toFixed(2)} <span>$</span></p>
      </div>
    </div>
  );
};

export default Header;