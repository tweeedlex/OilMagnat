import React from 'react';
import styles from "./Header.module.scss";
import bblIcon from "../../img/main/bbl.png";
import dollarIcon from "../../img/main/dollar.png";

const Header = ({isVisible = true}) => {
  return (
    <div className={styles.info} style={{display: (isVisible ? "flex" : "none")}}>
      <div className={styles.infoSide}>
        <img src={bblIcon} width={32} alt={""}/>
        <p>10,000 <span>BBL</span></p>
      </div>
      <svg width="0" height="0">
        <defs>
          <clipPath id="roundedPolygon" clipPathUnits="objectBoundingBox">
            <polygon points="0 0, 1 0.01, 0.8 1, 0.2 1.01"/>
          </clipPath>
        </defs>
      </svg>
      <div className={styles.oilStorage}>
        <p className={styles.oilAmount}>231,321</p>
      </div>
      <div className={[styles.infoSide, styles.right].join(" ")}>
        <img src={dollarIcon} width={32} alt={""}/>
        <p>10,000 <span>$</span></p>
      </div>
    </div>
  );
};

export default Header;