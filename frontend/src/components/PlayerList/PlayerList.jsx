import React from "react";
import styles from "./PlayerList.module.scss";
import personSmallIcon from "../../img/person-small.png";
import coinIcon from "../../img/coin.png";
import { Link } from "react-router-dom";
import formNumber from "../../helpers/formNumber";

const PlayerList = ({ list = [], isNumbered = false }) => {
	/*
    list: [
      {
        index,
        name,
        balance
      }
    ]
   */

	const avatarBaseUrl = `${import.meta.env.VITE_API_URL}/avatars/`;
	return (
		<div className={styles.leaderboard}>
			{list.map((item) => (
				<div key={item.index} className={[styles.leaderboardRow].join(" ")}>
					{" "}
					{/* styles.you */}
					<div>
						{isNumbered && <p>{item.index + 1}</p>}
						<img src={personSmallIcon} />
						<p>{item.name}</p>
					</div>
					<div>
						<img src={coinIcon} />
						<p className={styles.money}>{formNumber(item.balance)}</p>
					</div>
				</div>
			))}
		</div>
	);
};

export default PlayerList;
