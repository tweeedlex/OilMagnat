import React from 'react';
import styles from "./PlayerList.module.scss";
import personSmallIcon from "../../img/person-small.png";
import coinIcon from "../../img/coin.png";
import {Link} from "react-router-dom";

const PlayerList = ({list = [], isNumbered = false}) => {
  const avatarBaseUrl = `${import.meta.env.VITE_API_URL}/avatars/`;
  return (
    <div className={styles.leaderboard}>
      {list.map((item, index) => (
        <div key={item.index} className={[styles.leaderboardRow].join(" ")}> {/* styles.you */}
          <div>
            {isNumbered && <p>{index + 1}</p>}
            <img src={personSmallIcon}/>
            <p>{item.name}</p>
          </div>
          <div>
            <img src={coinIcon}/>
            <p className={styles.money}>{item.balance}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PlayerList;