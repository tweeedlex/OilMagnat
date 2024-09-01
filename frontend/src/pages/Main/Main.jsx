import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Main.module.scss";
import mapIcon from "../../img/main/map.png";
import personalIcon from "../../img/main/personal.png";
import companyIcon from "../../img/main/company.png";
import profileIcon from "../../img/main/profile.png";
import repairIcon from "../../img/main/repair.png";
import pumpIcon from "../../img/main/pump.png";
import Header from "../../components/Header/Header";
import { getMainPageInfo } from "../../http/main";

const Main = () => {
	const [mainPageInfo, setMainPageInfo] = useState({});

	useEffect(() => {
		getMainPageInfo().then((data) => {
			console.log(data);
			setMainPageInfo(data);
		});
	}, []);

  return (
    <div className={[styles.page, "page", "with-footer"].join(" ")}>
      <header className={styles.header}>
        <Header />
        <nav className={styles.navigation}>
          <Link to={""}>
            <img src={mapIcon} width={24} height={24} alt={""}/>
            <p>Map</p>
          </Link>
          <Link to={"/workers"}>
            <img src={personalIcon} width={24} height={24} alt={""}/>
            <p>Personal</p>
          </Link>
          <Link to={""}>
            <img src={companyIcon} width={24} height={24} alt={""}/>
            <p>Company</p>
          </Link>
          <Link to={"/profile"}>
            <img src={profileIcon} width={24} height={24} alt={""}/>
            <p>Profile</p>
          </Link>
        </nav>
      </header>
      <div className={styles.tools}>
        <button>
          <img src={repairIcon} alt={""}/>
          <p>Repair</p>
        </button>
        <div className={styles.durability}>
          <div style={{width: `${mainPageInfo.derrickWear}%`}} className={styles.fill}></div>
          <p>{mainPageInfo.derrickWear} %</p>
        </div>
        <button>
          <img src={pumpIcon} alt={""}/>
          <p>Pump oil</p>
        </button>
      </div>
    </div>
  );
};

export default Main;
