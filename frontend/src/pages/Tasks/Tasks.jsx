import React from 'react';
import styles from "./Tasks.module.scss";
import Button from "../../ui/Button/Button";
import telegramIcon from "../../img/tasks/telegram.png";
import xIcon from "../../img/tasks/x.png";
import coinIcon from "../../img/coin.png"

const Tasks = () => {
  return (
    <div className={"page"}>
      <div className={styles.tasks}>
        <div className={styles.task}>
          <div>
            <img src={telegramIcon} alt={""}/>
            <div className={styles.info}>
              <p>Join our Telegram channel</p>
              <p><img src={coinIcon} alt={""}/> <span>+10.000</span></p>
            </div>
          </div>
          <Button>
            Start
          </Button>
        </div>
        <div className={styles.task}>
          <div>
            <img src={xIcon} alt={""}/>
            <div className={styles.info}>
              <p>Join our X</p>
              <p><img src={coinIcon} alt={""}/> <span>+10.000</span></p>
            </div>
          </div>
          <Button>
            Claim
          </Button>
        </div>
        <div className={styles.task}>
          <div>
            <img src={telegramIcon} alt={""}/>
            <div className={styles.info}>
              <p>Join our Telegram channel</p>
              <p><img src={coinIcon} alt={""}/> <span>+10.000</span></p>
            </div>
          </div>
          <Button variant={"inactive"}>
            Completed
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
