import React from 'react';
import styles from "./Footer.module.scss";
import upgradesIcon from "../../img/footer/upgrades.png"
import marketIcon from "../../img/footer/market.png"
import tasksIcon from "../../img/footer/tasks.png"
import leaderboardIcon from "../../img/footer/leaderboard.png"
import mainIcon from "../../img/footer/main.png"
import upgradesIconInactive from "../../img/footer/upgrades-inactive.png"
import marketIconInactive from "../../img/footer/market-inactive.png"
import tasksIconInactive from "../../img/footer/tasks-inactive.png"
import leaderboardIconInactive from "../../img/footer/leaderboard-inactive.png"
import mainIconInactive from "../../img/footer/main-inactive.png"

import {Link} from "react-router-dom";

const Footer = () => {
  return (
    <>
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <nav className={styles.pageLinks}>
          <div>
            <Link className={styles.pageLink} to="/upgrades">
              <img src={upgradesIcon} width={40} height={40} alt=""/>
              <p>Upgrades</p>
            </Link>
            <Link className={styles.pageLink} to="/market">
              <img src={marketIcon} width={44} height={44} alt=""/>
              <p>Market</p>
            </Link>
          </div>
          <Link className={styles.mainLink} to="/">
            <img src={mainIcon} width={54} height={54} alt=""/>
          </Link>
          <div>
            <Link className={styles.pageLink} to="/tasks">
              <img src={tasksIcon} width={44} height={44} alt=""/>
              <p>Tasks</p>
            </Link>
            <Link className={styles.pageLink} to="/leaderboard">
              <img src={leaderboardIcon} width={54} height={54} alt=""/>
              <p>Leaderboard</p>
            </Link>
          </div>
        </nav>
      </div>
    </footer>
    <div className={styles.viniette}></div>
    </>
  );
};

export default Footer;