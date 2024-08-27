import React, {useEffect, useRef, useState} from 'react';
import styles from "./Profile.module.scss";
import PlayerList from "../../components/PlayerList/PlayerList";
import personIcon from "../../img/person.png";
import companyIcon from "../../img/profile/company.png"
import copyIcon from "../../img/profile/copy.png"
import {getUser} from "../../http/user";
import Preloader from "../../ui/Preloader/Preloader";

const Profile = () => {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    // setTimeout(() => {
      getUser().then((response) => {
        setInfo(response);
        console.log(response);
      });
    // }, 1000000)
  }, []);

  const referralLinkRef = useRef();

  const copyReferralLink = () => {
    const text = referralLinkRef.current.value;
    navigator.clipboard.writeText(text);
  }

  return (
    <div className={"page"}>
      {
        info
          ? (
            <>
              <div className={styles.profile}>
                <div className={styles.head}>
                  <div className={styles.headBlock}>
                    <img src={personIcon} alt={""}/>
                    <div className={styles.info}>
                      <p className={styles.sub}>Name</p>
                      <p className={styles.name}>@{info.user.tgUsername}</p>
                    </div>
                  </div>
                  <div className={styles.headBlock}>
                    <div className={styles.info}>
                      <p className={styles.sub}>Company</p>
                      <p className={styles.name}>{info.company || "Oilstar"}</p>
                    </div>
                    <img src={companyIcon} alt={""}/>
                  </div>
                </div>
                <div className={styles.table}>
                  <div className={styles.tableRow}>
                    <p>Oil fields</p>
                    <p className={styles.gold}>{info.boughtLocations}</p>
                  </div>
                  <div className={styles.tableRow}>
                    <p>Friends</p>
                    <p className={styles.gold}>{info.referrals.length}</p>
                  </div>
                  <div className={styles.tableRow}>
                    <p>Workers</p>
                    <p className={styles.gold}>{info.workersCount}/10</p>
                  </div>
                  <div className={styles.tableRow}>
                    <p>Total Resources</p>
                    <p className={styles.gold}>{info.oilAmount} BBL</p>
                  </div>
                  <div className={styles.tableRow}>
                    <p>Tasks Сompleted</p>
                    <p className={styles.gold}>{info.tasksCompleted}</p>
                  </div>
                  <div className={styles.tableRow}>
                    <p>Total Oil Production</p>
                    <p className={styles.gold}>{info.totalOilProduction} $</p>
                  </div>
                </div>
                <div className={styles.linkBlock}>
                  <input ref={referralLinkRef} value={info.refferalCode} readOnly={true}/>
                  <button onClick={() => copyReferralLink()}>
                    <img src={copyIcon} alt={""}/>
                  </button>
                </div>
              </div>
              <PlayerList list={info.referrals.map(ref => ({
                name: ref.nickName,
                avatar: ref.avatarUrl,
                balance: ref.balance,
              }))}/>
            </>
          )
          : (<Preloader />)
      }
    </div>
  );
};

export default Profile;
