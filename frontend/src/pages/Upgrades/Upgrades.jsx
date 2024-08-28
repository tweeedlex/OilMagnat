import React, {useState} from 'react'
import Switch from "../../ui/Switch/Switch";
import styles from "./Upgrades.module.scss"
import upgradesData from "./data.json"
import Button from "../../ui/Button/Button";
import pumpImage from "../../img/upgrades/pump.png"

const Upgrades = () => {
  const [upgrades, setUpgrades] = useState(upgradesData.pumps);

  return (
    <div className={["page with-footer", styles.page].join(" ")}>
      <Switch
        defaultOptions={[
          { text: "Oil pump", isActive: true, callback: () => setUpgrades(upgradesData.pumps) },
          { text: "Oil depot", callback: () => setUpgrades(upgradesData.depots) },
          { text: "Boost", callback: () => setUpgrades(upgradesData.boosts) }
        ]}
      />
      <div className={styles.upgrades}>
        {
          upgrades.map((upgrade, index) => (
            <div key={index} className={styles.upgrade}>
              <div className={styles.upgradeImage}>
                <img src={pumpImage} width={73} alt=""/>
              </div>
              <div className={styles.upgradeInfo}>
                <div>
                  <p className={styles.level}>Lvl {upgrade.level}</p>
                  <p className={styles.locked}>LOCKED</p>
                </div>
                <p>{upgrade.value} / hrs</p>
              </div>
              <Button width={120}>{upgrade.price} $</Button>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Upgrades;