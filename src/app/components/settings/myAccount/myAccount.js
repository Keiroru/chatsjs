"use client";

import { useState } from "react";
import style from "@/app/styles/account.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function MyAccount({ userData }) {
  const [lookingForFriends, setLookingForFriends] = useState(userData.lookingForFriends === 1 ? 1 : 0);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleLookingForFriends = async () => {
    const response = await fetch("/api/profile/updateLookingForFriends", {
      method: "POST",
      body: JSON.stringify({ isLookingForFriends: lookingForFriends === 0 ? 1 : 0, userId: userData.userId }),
    });
    if (response.ok) {
      console.log("Looking for friends updated successfully");
    } else {
      console.error("Failed to update looking for friends");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("/api/profile/deleteProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userData.userId }),
      });

      if (response.ok) {
        console.log("Account deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

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
            handleLookingForFriends();
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
        <button
          className={style.deleteAccountButton}
          onClick={() => setShowDeleteConfirmation(true)}
        >
          <FontAwesomeIcon icon={faTrash} /> Delete Account
        </button>
      </div>

      {showDeleteConfirmation && (
        <div className={style.confirmationOverlay}>
          <div className={style.confirmationDialog}>
            <h3 className={style.confirmationTitle}>Confirm</h3>
            <p className={style.confirmationMessage}>
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className={style.confirmationActions}>
              <button
                className={style.cancelButton}
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className={style.confirmDeleteButton}
                onClick={handleDeleteAccount}
              >
                <FontAwesomeIcon icon={faTrash} /> Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
