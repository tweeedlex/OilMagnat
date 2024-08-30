import React, {useEffect, useState} from 'react';
import styles from "./Leaderboard.module.scss";
import coinIcon from "../../img/coin.png";
import personIcon from "../../img/person.png"
import crownIcon from "../../img/leaderboard/crown.png"
import personSmallIcon from "../../img/person-small.png"
import PlayerList from "../../components/PlayerList/PlayerList";
import Switch from "../../ui/Switch/Switch";
import {getLeaderboard} from "../../http/leaderboard";
import Preloader from "../../ui/Preloader/Preloader";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState(null);
  const [type, setType] = useState("week");

  useEffect(() => {
    getLeaderboard().then(data => {
      setLeaderboard(
        type === "week"
          ? data.topUsersWeek.map(item => ({...item, balance: formNumber(item.balance)}))
          : data.topUsersAllTime.map(item => ({...item, balance: formNumber(item.balance)}))
      );
    });
  }, [type])

  const formNumber = (number) => {
    if (number < 1000) {
      return number;
    }
    if (number < 1000000) {
      return (number / 1000).toFixed(1) + "K";
    }
    if (number < 1000000000) {
      return (number / 1000000).toFixed(1) + "M";
    }
    return (number / 1000000000).toFixed(1) + "B";
  }

  return (
    <>{
      leaderboard
        ? (
          <div className="page with-footer">
            <Switch
              defaultOptions={[
                {text: "For the week", isActive: true, callback: () => setType("week")},
                {
                  text: "For all time", callback: () => setType("all")
                }]}
            />
            <div className={styles.top}>
              <div className={[styles.topBlock, styles.topBlockSilver].join(" ")}>
                <div className={styles.topImageWrapper}>
                  <div className={styles.topImage}>
                    <img className={styles.avatar} src={personIcon} alt=""/>
                  </div>
                  <p className={styles.number}>2</p>
                </div>
                <p>{leaderboard[1]?.nickName}</p>
                <p className={styles.money}><img src={coinIcon} width={16} height={16}/>
                  {leaderboard[1]?.balance}
                </p>
              </div>
              <div className={[styles.topBlock, styles.topBlockGold].join(" ")}>
                <img className={styles.crown} src={crownIcon} alt=""/>
                <div className={styles.topImageWrapper}>
                  <div className={styles.topImage}>
                    <img className={styles.avatar} src={personIcon} alt=""/>
                  </div>
                  <p className={styles.number}>1</p>
                </div>
                <p>{leaderboard[0]?.nickName}</p>
                <p className={styles.money}><img src={coinIcon} width={16} height={16}/>{leaderboard[0]?.balance}</p>
              </div>
              <div className={[styles.topBlock, styles.topBlockBronze].join(" ")}>
                <div className={styles.topImageWrapper}>
                  <div className={styles.topImage}>
                    <img className={styles.avatar} src={personIcon} alt=""/>
                  </div>
                  <p className={styles.number}>3</p>
                </div>
                <p>{leaderboard[2]?.nickName}</p>
                <p className={styles.money}><img src={coinIcon} width={16} height={16}/>{leaderboard[2]?.balance}</p>
              </div>
            </div>

            <PlayerList list={
              leaderboard.slice(3).map((item, index) => ({
                avatar: item.avatarUrl,
                name: item.nickName,
                index: item.position - 1,
                balance: item.balance
              }))
            } isNumbered={true}/>
          </div>
        )
        : (
          <div className="page with-footer">
            <Preloader/>
          </div>
        )
    }</>
  );
};

export default Leaderboard;
