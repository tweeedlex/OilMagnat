import React, { useEffect, useState } from "react";
import styles from "./Header.module.scss";
import bblIcon from "../../img/main/bbl.png";
import dollarIcon from "../../img/main/dollar.png";
import { useSelector } from "react-redux";
import leftBg from "../../img/main/left.png";
import rightBg from "../../img/main/right.png";

const Header = ({ isVisible = true }) => {
	const user = useSelector((state) => state.user);

	// background: urL("/public/img/left.png") no-repeat 0 0 / contain;

	return (
		<div
			className={[styles.info].join(" ")}
			style={{ display: isVisible ? "flex" : "none", background: `url(${leftBg}) no-repeat 0 0 / contain` }}>
			<div className={styles.infoSide}>
				<img src={bblIcon} width={32} alt={""} />
				<p>
					{user.oilAmount?.toFixed(2)} <span>BBL</span>
				</p>
			</div>
			<div className={styles.oilStorage}>
				<div className={styles.fill} style={{ height: `${(user.notClaimedOil / user.maxOilAmount) * 100}%` }}></div>
				<p className={styles.oilAmount}>{user.notClaimedOil != 0 ? user.notClaimedOil?.toFixed(2) : 0}</p>
			</div>
			<div
				className={[styles.infoSide, styles.right].join(" ")}
				style={{ background: `url(${rightBg}) no-repeat 100% 0 / contain` }}>
				<img src={dollarIcon} width={32} alt={""} />
				<p>
					{user.balance?.toFixed(2)} <span>$</span>
				</p>
			</div>
		</div>
	);
};

export default Header;
