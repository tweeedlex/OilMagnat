import React from 'react';
import {Link} from "react-router-dom";
import styles from "./Main.module.scss"
import mapIcon from "../../img/main/map.png"
import personalIcon from "../../img/main/personal.png"
import companyIcon from "../../img/main/company.png"
import profileIcon from "../../img/main/profile.png"

const Main = () => {
  return (
    <div className={[styles.page, "page", "with-footer"].join(" ")}>
      <header className={styles.header}>
        <div className={styles.info}>
          <div className={styles.infoSide}>
            <img src={""} alt={""}/>
            <p>10,000 BBL</p>
          </div>
          <div className={styles.oilStorage}>
            <p className={styles.oilAmount}>231,321</p>
          </div>
          <div className={[styles.infoSide, styles.right].join(" ")}>
            <p>10,000 $</p>
            <img src={""} alt={""}/>
          </div>
        </div>
        <nav className={styles.navigation}>
          <Link to={""}>
            <img src={mapIcon} width={24} height={24} alt={""}/>
            <p>Map</p>
          </Link>
          <Link to={""}>
            <img src={personalIcon} width={24} height={24} alt={""}/>
            <p>Personal</p>
          </Link>
          <Link to={""}>
            <img src={companyIcon} width={24} height={24} alt={""}/>
            <p>Company</p>
          </Link>
          <Link to={""}>
            <img src={profileIcon} width={24} height={24} alt={""}/>
            <p>Profile</p>
          </Link>
        </nav>
      </header>
      <div className={styles.tools}>
        <button>
          <img alt={""}/>
          <p>Repair</p>
        </button>
        <div className={styles.durability}>
          <p>80%</p>
        </div>
        <button>
          <img alt={""}/>
          <p>Pump oil</p>
        </button>
      </div>
    </div>
  );
};

export default Main;
