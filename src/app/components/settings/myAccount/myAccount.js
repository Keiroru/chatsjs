"use client";

import { useState } from "react";
import style from "@/app/styles/account.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTrash, faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";

export default function MyAccount({ userData }) {
  const [lookingForFriends, setLookingForFriends] = useState(userData.lookingForFriends);

  return (
    <div className={style.accountContainer}>
      <h1 className={style.accountTitle}>My Account</h1>
      <p className={style.accountDescription}>
        Welcome to your account settings page. Here you can update your account
        information and manage your preferences.
      </p>

      <div className={style.accountSection}>
        <h2 className={style.accountSectionTitle}>Account Information</h2>
        <table className={style.accountTable}>
          <tbody>
            <tr className={style.accountTableRow}>
              <th className={`${style.accountTableCell} ${style.accountTableHeader}`}>Email</th>
              <td className={`${style.accountTableCell} ${style.accountTableData}`}>{userData.email}</td>
              <td className={`${style.accountTableCell} ${style.accountTableAction}`}>
                <button className={style.defaultButton}>Change Email</button>
              </td>
            </tr>
            <tr className={style.accountTableRow}>
              <th className={`${style.accountTableCell} ${style.accountTableHeader}`}>User ID</th>
              <td className={`${style.accountTableCell} ${style.accountTableData}`}>#{userData.displayId}</td>
              <td className={`${style.accountTableCell} ${style.accountTableAction}`}>
                <button className={style.defaultButton}>Change User ID</button>
              </td>
            </tr>
            <tr className={style.accountTableRow}>
              <th className={`${style.accountTableCell} ${style.accountTableHeader}`}>Password</th>
              <td className={`${style.accountTableCell} ${style.accountTableData}`}>••••••••</td>
              <td className={`${style.accountTableCell} ${style.accountTableAction}`}>
                <button className={style.defaultButton}>Change Password</button>
              </td>
            </tr>
            <tr className={style.accountTableRow}>
              <th className={`${style.accountTableCell} ${style.accountTableHeader}`}>Member Since</th>
              <td className={`${style.accountTableCell} ${style.accountTableData}`}>
                {new Date(userData.createdAt).toLocaleDateString()}
              </td>
              <td className={`${style.accountTableCell} ${style.accountTableAction}`}></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={style.lookingForFriends}>
        <h2 className={style.lookingForFriendsTitle}>Friend Preferences</h2>
        <div className={style.lookingForFriendsStatus}>
          <span className={style.statusLabel}>Looking for friends:</span>
          <span className={style.statusValue}>{lookingForFriends ? "Yes" : "No"}</span>
        </div>
        <button
          className={style.defaultButton}
          onClick={() => {
            setLookingForFriends(!lookingForFriends);
          }}
        >
          {lookingForFriends ? "Stop Looking for Friends" : "Start Looking for Friends"}
        </button>
      </div>

      <div className={style.deleteAccountSection}>
        <h2 className={style.deleteAccountTitle}>Danger Zone</h2>
        <p className={style.deleteAccountDescription}>
          Once you delete your account, there is no going back.
        </p>
        <button className={style.deleteAccountButton} type="submit">
          <FontAwesomeIcon icon={faTrash} /> Delete Account
        </button>
      </div>
    </div>
  );
}
