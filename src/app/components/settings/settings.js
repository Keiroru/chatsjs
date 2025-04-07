"use client";

import { useState, useEffect } from "react";
import style from "@/app/styles/settings.module.css";
import Profile from "@/app/components/settings/profile/profile";
import Account from "@/app/components/settings/myAccount/myAccount";
import Report from "./bugReport/report";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faUser,
  faUserCircle,
  faPalette,
  faBug,
} from "@fortawesome/free-solid-svg-icons";

export default function Settings({ userData, isMobile, toggleSettings }) {
  const [selectedOption, setSelectedOption] = useState("");
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsSmallScreen(window.innerWidth <= 900);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!selectedOption && windowWidth > 900) {
      setSelectedOption("account");
    }
  }, [selectedOption, windowWidth]);

  const handleBackClick = () => {
    if ((isMobile || isSmallScreen) && selectedOption) {
      setSelectedOption("");
    } else {
      toggleSettings();
    }
  };

  return (
    <div className={style.settingsContainer}>
      {(isMobile || isSmallScreen) && (
        <button
          className={`${style["icon-button"]} ${style["back-button"]}`}
          onClick={handleBackClick}
          aria-label={
            selectedOption ? "Back to settings menu" : "Back to main page"
          }
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      )}
      <aside
        className={`${style["settingsSidebar"]} ${(isMobile || isSmallScreen) && selectedOption
          ? style["closed"]
          : style["open"]
          }`}
      >
        <h2>Settings</h2>
        <div className={style.settingsNav}>
          <h4>User Settings</h4>
          <ul>
            <li
              className={selectedOption === "account" ? style.active : ""}
              onClick={() => setSelectedOption("account")}
            >
              <FontAwesomeIcon icon={faUser} />
              <span>My Account</span>
            </li>
            <li
              className={selectedOption === "profile" ? style.active : ""}
              onClick={() => setSelectedOption("profile")}
            >
              <FontAwesomeIcon icon={faUserCircle} />
              <span>Profile</span>
            </li>
          </ul>
          <h4>App Settings</h4>
          <ul>
            <li
              className={selectedOption === "appearance" ? style.active : ""}
              onClick={() => setSelectedOption("appearance")}
            >
              <FontAwesomeIcon icon={faPalette} />
              <span>Appearance</span>
            </li>
          </ul>
          <h4>Other</h4>
          <ul>
            <li
              className={selectedOption === "bugreport" ? style.active : ""}
              onClick={() => setSelectedOption("bugreport")}
            >
              <FontAwesomeIcon icon={faBug} />
              <span>Report a bug</span>
            </li>
          </ul>
        </div>
      </aside>

      <main
        className={`${style["settingsContent"]} ${(isMobile || isSmallScreen) && selectedOption
          ? style["open"]
          : style["closed"]
          }`}
      >
        {!selectedOption && (
          <div className={style.settingsPanel}>
            <h3>Welcome to Settings</h3>
            <p>
              Please select a setting option from the sidebar to get started.
            </p>
          </div>
        )}
        {selectedOption === "profile" && (
          <div className={style.settingsPanel}>
            <Profile userData={userData} />
          </div>
        )}
        {selectedOption === "account" && (
          <div className={style.settingsPanel}>
            <Account userData={userData} />
          </div>
        )}
        {selectedOption === "appearance" && (
          <div className={style.settingsPanel}>
            <h3>Appearance Settings</h3>
            <p>Appearance settings will be available soon.</p>
            <p>Select theme</p>
            <p>Change language</p>
          </div>
        )}
        {selectedOption === "bugreport" && (
          <div className={style.settingsPanel}>
            <Report userData={userData} />
          </div>
        )}
      </main>
    </div>
  );
}
