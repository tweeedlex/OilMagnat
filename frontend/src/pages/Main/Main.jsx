import React from "react";
import { Link } from "react-router-dom";
import styles from "./Main.module.scss";
import mapIcon from "../../img/main/map.png";
import personalIcon from "../../img/main/personal.png";
import companyIcon from "../../img/main/company.png";
import profileIcon from "../../img/main/profile.png";
import bblIcon from "../../img/main/bbl.png";
import dollarIcon from "../../img/main/dollar.png";
import repairIcon from "../../img/main/repair.png";
import pumpIcon from "../../img/main/pump.png";
import durabilityIcon from "../../img/main/durability.svg";

const Main = () => {
	return (
		<div className={[styles.page, "page", "with-footer"].join(" ")}>
			<header className={styles.header}>
				<div className={styles.info}>
					<div className={styles.infoSide}>
						<img src={bblIcon} width={32} alt={""} />
						<p>
							10,000 <span>BBL</span>
						</p>
					</div>
					<svg width="0" height="0">
						<defs>
							<clipPath id="roundedPolygon" clipPathUnits="objectBoundingBox">
								<polygon points="0 0, 1 0.01, 0.8 1, 0.2 1.01" />
							</clipPath>
						</defs>
					</svg>
					<div className={styles.oilStorage}>
						<p className={styles.oilAmount}>231,321</p>
					</div>
					<div className={[styles.infoSide, styles.right].join(" ")}>
						<img src={dollarIcon} width={32} alt={""} />
						<p>
							10,000 <span>$</span>
						</p>
					</div>
				</div>
				<nav className={styles.navigation}>
					<Link to={""}>
						<img src={mapIcon} width={24} height={24} alt={""} />
						<p>Map</p>
					</Link>
					<Link to={""}>
						<img src={personalIcon} width={24} height={24} alt={""} />
						<p>Personal</p>
					</Link>
					<Link to={""}>
						<img src={companyIcon} width={24} height={24} alt={""} />
						<p>Company</p>
					</Link>
					<Link to={"/profile"}>
						<img src={profileIcon} width={24} height={24} alt={""} />
						<p>Profile</p>
					</Link>
				</nav>
			</header>
			<div className={styles.tools}>
				<button>
					<img src={repairIcon} alt={""} />
					<p>Repair</p>
				</button>
				<div className={styles.durability}>
					<p>80 %</p>
				</div>
				<button>
					<img src={pumpIcon} alt={""} />
					<p>Pump oil</p>
				</button>
			</div>
		</div>
	);
};

export default Main;
