"use client";

import { useState } from "react";
import Image from "next/image";
import style from "./settings.module.css";
import Profile from "./profile/profile";

export default function Settings({ userData }) {
    const [selectedOption, setSelectedOption] = useState("profile");
    const [formData, setFormData] = useState({
        displayName: userData.displayName,
        email: userData.email,
        bio: userData?.bio || "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className={style.settingsContainer}>
            <aside className={style.settingsSidebar}>
                <h2>Settings</h2>
                <div className={style.settingsNav}>
                    <h4>User Settings</h4>
                    <ul>
                        <li className={selectedOption === "account" ? style.active : ""}
                            onClick={() => setSelectedOption("account")}>
                            <span>My Account</span>
                        </li>
                        <li className={selectedOption === "profile" ? style.active : ""}
                            onClick={() => setSelectedOption("profile")}>
                            <span>Profile</span>
                        </li>
                    </ul>
                    <h4>App Settings</h4>
                    <ul>
                        <li className={selectedOption === "appearance" ? style.active : ""}
                            onClick={() => setSelectedOption("appearance")}>
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
                        <p>Nincs</p>
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