import React, {useState} from 'react';
import Switch from "../../ui/Switch/Switch";
import styles from "./Workers.module.scss";
import Button from "../../ui/Button/Button";
import data from "./data.json";
import formNumber from "../../helpers/formNumber";
import workerImage from "../../img/workers/worker.png";
import traderImage from "../../img/workers/trader.png";
import consultantImage from "../../img/workers/consultant.png"

const images = { workerImage, traderImage, consultantImage };

const Workers = () => {
  const [page, setPage] = useState("workers");

  return (
    <div className={"page with-footer"}>
      <Switch
        defaultOptions={[{text: "Worker", callback: () => setPage("workers"), isActive: true}, {
          text: "Traders",
          callback: () => setPage("traders")
        }, {text: "Consultants", callback: () => setPage("consultants")}]}
      />
      <div className={styles.workers}>
        {
          data[page].map(worker => (
            <div className={styles.worker}>
              <img src={images[worker.img]}/>
              <div className={styles.workerInfo}>
                <div className={styles.infoHead}>
                  <p>{worker.name}</p>
                  <p className={styles.sub}>{worker.description}</p>
                </div>
                <div className={styles.infoFooter}>
                  <div>
                    <p>Repair speed: <span className={styles.orange}>+{worker.speed} %</span></p>
                    <p>Costs:
                      <span className={styles.orange}>{formNumber(worker.costDollars, false)} </span>
                      <span className={styles.gray}>$ </span>/
                      <span className={styles.orange}> {formNumber(worker.costOil, false)} </span>
                      <span className={styles.gray}>BBL</span>
                    </p>
                  </div>
                  <Button width={120}>Recruit</Button>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Workers;