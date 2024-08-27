import React from 'react';
import styles from "./Profile.module.scss";
import PlayerList from "../../components/PlayerList/PlayerList";
import personIcon from "../../img/person.png";
import companyIcon from "../../img/profile/company.png"
import copyIcon from "../../img/profile/copy.png"

const Profile = () => {
  return (
    <div className={"page"}>
      <div className={styles.profile}>
        <div className={styles.head}>
          <div className={styles.headBlock}>
            <img src={personIcon} alt={""}/>
            <div className={styles.info}>
              <p className={styles.sub}>Name</p>
              <p className={styles.name}>@magnatoil</p>
            </div>
          </div>
          <div className={styles.headBlock}>
            <div className={styles.info}>
              <p className={styles.sub}>Company</p>
              <p className={styles.name}>Oilstar</p>
            </div>
            <img src={companyIcon} alt={""}/>
          </div>
        </div>
        <div className={styles.table}>
          <div className={styles.tableRow}>
            <p>Oil fields</p>
            <p className={styles.gold}>3</p>
          </div>
          <div className={styles.tableRow}>
            <p>Friends</p>
            <p className={styles.gold}>10</p>
          </div>
          <div className={styles.tableRow}>
            <p>Workers</p>
            <p className={styles.gold}>3/10</p>
          </div>
          <div className={styles.tableRow}>
            <p>Total Resources</p>
            <p className={styles.gold}>10M BBL</p>
          </div>
          <div className={styles.tableRow}>
            <p>Tasks Сompleted</p>
            <p className={styles.gold}>830</p>
          </div>
          <div className={styles.tableRow}>
            <p>Total Oil Production</p>
            <p className={styles.gold}>83M $</p>
          </div>
        </div>
        <div className={styles.linkBlock}>
          <input value={"t.me/OilRigs30023sdadaInvite"} />
          <button>
            <img src={copyIcon} alt={""}/>
          </button>
        </div>
      </div>
      <PlayerList />
    </div>
  );
};

export default Profile;
