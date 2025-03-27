"use client";

import { useState } from "react";
import style from "@/app/styles/settings.module.css";
import Profile from "@/app/components/settings/profile/profile";
import Account from "@/app/components/settings/myAccount/myAccount";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function Settings({
  userData,
  isMobile,
  onBackToContacts,
  toggleSettings,
}) {
  const [selectedOption, setSelectedOption] = useState("profile");

  return (
    <div className={style.settingsContainer}>
      <aside className={style.settingsSidebar}>
        {isMobile && (
          <button
            className={`${style["icon-button"]} ${style["back-button"]}`}
            onClick={toggleSettings}
            aria-label="Back to contacts"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        )}
        <h2>Settings</h2>
        <div className={style.settingsNav}>
          <h4>User Settings</h4>
          <ul>
            <li
              className={selectedOption === "account" ? style.active : ""}
              onClick={() => setSelectedOption("account")}
            >
              <span>My Account</span>
            </li>
            <li
              className={selectedOption === "profile" ? style.active : ""}
              onClick={() => setSelectedOption("profile")}
            >
              <span>Profile</span>
            </li>
          </ul>
          <h4>App Settings</h4>
          <ul>
            <li
              className={selectedOption === "appearance" ? style.active : ""}
              onClick={() => setSelectedOption("appearance")}
            >
              <span>Appearance</span>
            </li>
          </ul>
        </div>
      </aside>

      <main className={style.settingsContent}>
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
            <p>Nincs</p>
          </div>
        )}
      </main>
    </div>
  );
}
