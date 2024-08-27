import React from 'react';
import styles from "./PlayerList.module.scss";
import personSmallIcon from "../../img/person-small.png";
import coinIcon from "../../img/leaderboard/coin.png";
import {Link} from "react-router-dom";

const PlayerList = () => {
  return (
    <div className={styles.leaderboard}>
      <Link to={"/profile"} className={[styles.leaderboardRow, styles.you].join(" ")}>
        <div>
          <p>4</p>
          <img src={personSmallIcon}/>
          <p>Your rank</p>
        </div>
        <div>
          <img src={coinIcon}/>
          <p className={styles.money}>3.2M</p>
        </div>
      </Link>
      <Link to={"/profile"} className={styles.leaderboardRow}>
        <div>
          <p>4</p>
          <img src={personSmallIcon}/>
          <p>@user 123</p>
        </div>
        <div>
          <img src={coinIcon}/>
          <p className={styles.money}>3.2M</p>
        </div>
      </Link>
      <Link to={"/profile"} className={styles.leaderboardRow}>
        <div>
          <p>4</p>
          <img src={personSmallIcon}/>
          <p>@user 123</p>
        </div>
        <div>
          <img src={coinIcon}/>
          <p className={styles.money}>3.2M</p>
        </div>
      </Link>
    </div>
  )
}

export default PlayerList;