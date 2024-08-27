import React from 'react';
import styles from "./PlayerList.module.scss";
import personSmallIcon from "../../img/person-small.png";
import coinIcon from "../../img/leaderboard/coin.png";

const PlayerList = () => {
  return (
    <div className={styles.leaderboard}>
      <div className={[styles.leaderboardRow, styles.you].join(" ")}>
        <div>
          <p>4</p>
          <img src={personSmallIcon}/>
          <p>Your rank</p>
        </div>
        <div>
          <img src={coinIcon}/>
          <p className={styles.money}>3.2M</p>
        </div>
      </div>
      <div className={styles.leaderboardRow}>
        <div>
          <p>4</p>
          <img src={personSmallIcon}/>
          <p>@user 123</p>
        </div>
        <div>
          <img src={coinIcon}/>
          <p className={styles.money}>3.2M</p>
        </div>
      </div>
      <div className={styles.leaderboardRow}>
        <div>
          <p>4</p>
          <img src={personSmallIcon}/>
          <p>@user 123</p>
        </div>
        <div>
          <img src={coinIcon}/>
          <p className={styles.money}>3.2M</p>
        </div>
      </div>
    </div>
  )
}

export default PlayerList;