"use client";

import { useState, useEffect } from "react";
import style from "@/app/styles/settings.module.css";
import Profile from "@/app/components/settings/profile";
import Account from "@/app/components/settings/myAccount";
import Report from "@/app/components/settings/report";
import Appearance from "@/app/components/settings/Appearance";
import Logins from "@/app/components/settings/logins";
import { useTranslation } from "@/contexts/TranslationContext";
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
  const { t } = useTranslation();
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
        className={`${style["settingsSidebar"]} ${
          (isMobile || isSmallScreen) && selectedOption
            ? style["closed"]
            : style["open"]
        }`}
      >
        <h2>{t("settings")}</h2>
        <div className={style.settingsNav}>
          <h4>{t("usersettings")}</h4>
          <ul>
            <li
              className={selectedOption === "account" ? style.active : ""}
              onClick={() => setSelectedOption("account")}
            >
              <FontAwesomeIcon icon={faUser} />
              <span>{t("account")}</span>
            </li>
            <li
              className={selectedOption === "logins" ? style.active : ""}
              onClick={() => setSelectedOption("logins")}
            >
              <FontAwesomeIcon icon={faUser} />
              <span>{t("account")} gergfreu login</span>
            </li>
            <li
              className={selectedOption === "profile" ? style.active : ""}
              onClick={() => setSelectedOption("profile")}
            >
              <FontAwesomeIcon icon={faUserCircle} />
              <span>{t("profile")}</span>
            </li>
          </ul>
          <h4>{t("appsettings")}</h4>
          <ul>
            <li
              className={selectedOption === "appearance" ? style.active : ""}
              onClick={() => setSelectedOption("appearance")}
            >
              <FontAwesomeIcon icon={faPalette} />
              <span>{t("appearance")}</span>
            </li>
          </ul>
          <h4>{t("other")}</h4>
          <ul>
            <li
              className={selectedOption === "bugreport" ? style.active : ""}
              onClick={() => setSelectedOption("bugreport")}
            >
              <FontAwesomeIcon icon={faBug} />
              <span>{t("bugreport")}</span>
            </li>
          </ul>
        </div>
      </aside>

      <main
        className={`${style["settingsContent"]} ${
          (isMobile || isSmallScreen) && selectedOption
            ? style["open"]
            : style["closed"]
        }`}
      >
        {!selectedOption && (
          <div className={style.settingsPanel}>
            <h3>{t("welcome")}</h3>
            <p>{t("selectoption")}</p>
          </div>
        )}
        {selectedOption === "profile" && (
          <div className={style.settingsPanel}>
            <Profile userData={userData} />
          </div>
        )}
        {selectedOption === "logins" && (
          <div className={style.settingsPanel}>
            <Logins userData={userData} />
          </div>
        )}
        {selectedOption === "account" && (
          <div className={style.settingsPanel}>
            <Account userData={userData} />
          </div>
        )}
        {selectedOption === "appearance" && (
          <div className={style.settingsPanel}>
            <Appearance />
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
