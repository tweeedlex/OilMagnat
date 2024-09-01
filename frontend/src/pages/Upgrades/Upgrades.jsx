import React, { useState } from "react";
import Switch from "../../ui/Switch/Switch";
import styles from "./Upgrades.module.scss";
import upgradesData from "./data.json";
import Button from "../../ui/Button/Button";
import pumpImage from "../../img/upgrades/pump.png";
import depotImage1 from "../../img/upgrades/depot1.png";
import depotImage2 from "../../img/upgrades/depot2.png";
import depotImage3 from "../../img/upgrades/depot3.png";
import depotImage4 from "../../img/upgrades/depot4.png";
import depotImage5 from "../../img/upgrades/depot5.png";
import depotImage6 from "../../img/upgrades/depot6.png";
import boostImage1 from "../../img/upgrades/boost1.png";
import boostImage2 from "../../img/upgrades/boost2.png";
import boostImage3 from "../../img/upgrades/boost3.png";
import boostImage4 from "../../img/upgrades/boost4.png";
import boostImage5 from "../../img/upgrades/boost5.png";

const images = {
	pumpImage,
	depotImage1,
	depotImage2,
	depotImage3,
	depotImage4,
	depotImage5,
	depotImage6,
	boostImage1,
	boostImage2,
	boostImage3,
	boostImage4,
	boostImage5,
};

const Upgrades = () => {
	const [upgradesType, setUpgradesType] = useState("pumps");

	return (
		<div className={["page with-footer", styles.page].join(" ")}>
			<Switch
				defaultOptions={[
					{ text: "Oil pump", isActive: true, callback: () => setUpgradesType("pumps") },
					{ text: "Oil depot", callback: () => setUpgradesType("depots") },
					{ text: "Boost", callback: () => setUpgradesType("boosts") },
				]}
			/>
			<div className={styles.upgrades}>
				{upgradesData[upgradesType].map((upgrade, index) => (
					<div key={index} className={styles.upgrade}>
						<div className={styles.upgradeImage}>
							<img src={images[upgrade.img]} width={73} alt="" />
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
				))}
			</div>
		</div>
	);
};

export default Upgrades;
