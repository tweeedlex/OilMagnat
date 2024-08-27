import React from 'react';
import styles from "./Leaderboard.module.scss";
import coinIcon from "../../img/leaderboard/coin.png";
import personIcon from "../../img/leaderboard/person.png"
import crownIcon from "../../img/leaderboard/crown.png"
import personSmallIcon from "../../img/leaderboard/person-small.png"

const Leaderboard = () => {
  return (
    <div className="page with-footer">
      <div className={styles.switch}>
        <button className={styles.active}>For the week</button>
        <button>For all time</button>
      </div>
      <div className={styles.top}>
        <div className={[styles.topBlock, styles.topBlockSilver].join(" ")}>
          <div className={styles.topImageWrapper}>
            <div className={styles.topImage}>
              <img className={styles.avatar} src={personIcon} alt=""/>
            </div>
            <p className={styles.number}>2</p>
          </div>
          <p>@magnat</p>
          <p className={styles.money}><img src={coinIcon} width={16} height={16}/>3.1M</p>
        </div>
        <div className={[styles.topBlock, styles.topBlockGold].join(" ")}>
          <img className={styles.crown} src={crownIcon} alt=""/>
          <div className={styles.topImageWrapper}>
            <div className={styles.topImage}>
              <img className={styles.avatar} src={personIcon} alt=""/>
            </div>
            <p className={styles.number}>1</p>
          </div>
          <p>@neftebarb</p>
          <p className={styles.money}><img src={coinIcon} width={16} height={16}/>3.5M</p>
        </div>
        <div className={[styles.topBlock, styles.topBlockBronze].join(" ")}>
          <div className={styles.topImageWrapper}>
            <div className={styles.topImage}>
              <img className={styles.avatar} src={personIcon} alt=""/>
            </div>
            <p className={styles.number}>3</p>
          </div>
          <p>@oilman</p>
          <p className={styles.money}><img src={coinIcon} width={16} height={16}/>2.5M</p>
        </div>
      </div>

      <div className={styles.leaderboard}>
        <div className={[styles.leaderboardRow, styles.you].join(" ")}>
          <div>
            <p>4</p>
            <img src={personSmallIcon}/>
            <p>You rank</p>
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
    </div>
  );
};

export default Leaderboard;
