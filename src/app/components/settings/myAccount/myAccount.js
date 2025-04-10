"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import style from "@/app/styles/account.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function MyAccount({ userData }) {
  const [lookingForFriends, setLookingForFriends] = useState(
    userData.isLookingForFriends === 1 ? 1 : 0
  );
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeUserId, setShowChangeUserId] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [userIdError, setUserIdError] = useState("");
  const router = useRouter();

  const handleLookingForFriends = async () => {
    const newValue = lookingForFriends === 0 ? 1 : 0;
    const response = await fetch("/api/profile/updateLookingForFriends", {
      method: "POST",
      body: JSON.stringify({
        isLookingForFriends: newValue,
        userId: userData.userId,
      }),
    });
    if (response.ok) {
      setLookingForFriends(newValue);
      window.location.reload();
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
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userData.userId }),
        });
        router.push("/");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const handleChangeEmail = async () => {
    const newEmail = document.getElementById("newEmail").value;
    const response = await fetch("/api/profile/updateEmail", {
      method: "POST",
      body: JSON.stringify({ email: newEmail, userId: userData.userId }),
    });
    if (response.ok) {
      setShowChangeEmail(false);
      setEmailError("");
      window.location.reload();
    } else {
      const data = await response.json();
      setEmailError(data.error);
    }
  };

  const handleChangePassword = async () => {
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    const response = await fetch("/api/profile/updatePassword", {
      method: "POST",
      body: JSON.stringify({ password: newPassword, userId: userData.userId }),
    });
    if (response.ok) {
      setShowChangePassword(false);
      setPasswordError("");
    } else {
      const data = await response.json();
      setPasswordError(data.error);
    }
  };

  const handleChangeUserId = async () => {
    const newUserId = document.getElementById("newUserId").value;
    const response = await fetch("/api/profile/updateUserId", {
      method: "POST",
      body: JSON.stringify({
        displayId: newUserId,
        userId: userData.userId,
        displayName: userData.displayName,
      }),
    });
    if (response.ok) {
      setShowChangeUserId(false);
      setUserIdError("");
      window.location.reload();
    } else {
      const data = await response.json();
      setUserIdError(data.error);
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
        <div className={style.accountGrid}>
          <div
            className={`${style.accountGridItem} ${style.accountGridHeader}`}
          >
            Email
          </div>
          <div className={style.accountGridItem}>{userData.email}</div>
          <div className={style.accountGridItem}>
            <button
              onClick={() => setShowChangeEmail(true)}
              className={style.defaultButton}
            >
              Change Email
            </button>
          </div>

          <div
            className={`${style.accountGridItem} ${style.accountGridHeader}`}
          >
            User ID
          </div>
          <div className={style.accountGridItem}>#{userData.displayId}</div>
          <div className={style.accountGridItem}>
            <button
              onClick={() => setShowChangeUserId(true)}
              className={style.defaultButton}
            >
              Change User ID
            </button>
          </div>

          <div
            className={`${style.accountGridItem} ${style.accountGridHeader}`}
          >
            Password
          </div>
          <div className={style.accountGridItem}>••••••••</div>
          <div className={style.accountGridItem}>
            <button
              onClick={() => setShowChangePassword(true)}
              className={style.defaultButton}
            >
              Change Password
            </button>
          </div>

          <div
            className={`${style.accountGridItem} ${style.accountGridHeader}`}
          >
            Member Since
          </div>
          <div className={style.accountGridItem}>
            {new Date(userData.createdAt).toLocaleDateString()}
          </div>
          <div className={style.accountGridItem}></div>
        </div>
      </div>

      <div className={style.lookingForFriends}>
        <h2 className={style.lookingForFriendsTitle}>Friend Preferences</h2>
        <div className={style.lookingForFriendsStatus}>
          <span className={style.statusLabel}>Looking for friends:</span>
          <span className={style.statusValue}>
            {lookingForFriends === 1 ? "Yes" : "No"}
          </span>
        </div>
        <button
          className={style.defaultButton}
          onClick={() => {
            setLookingForFriends(!lookingForFriends);
            handleLookingForFriends();
          }}
        >
          {lookingForFriends === 1
            ? "Stop Looking for Friends"
            : "Start Looking for Friends"}
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
              Are you sure you want to delete your account? This action cannot
              be undone.
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

      {showChangeEmail && (
        <div className={style.confirmationOverlay}>
          <div className={style.normalConfirmationDialog}>
            <h3 className={style.confirmationTitle}>Change Email</h3>
            {emailError && <p className={style.errorText}>{emailError}</p>}
            <label htmlFor="newEmail">New Email</label>
            <input
              type="email"
              className={style.changeEmailInput}
              id="newEmail"
            />
            <div className={style.confirmationActions}>
              <button
                className={style.emailCancelButton}
                onClick={() => {
                  setShowChangeEmail(false);
                  setEmailError("");
                }}
              >
                Cancel
              </button>
              <button
                className={style.emailChangeButton}
                onClick={handleChangeEmail}
              >
                Change Email
              </button>
            </div>
          </div>
        </div>
      )}

      {showChangePassword && (
        <div className={style.confirmationOverlay}>
          <div className={style.normalConfirmationDialog}>
            <h3 className={style.confirmationTitle}>Change Password</h3>
            {passwordError && (
              <p className={style.errorText}>{passwordError}</p>
            )}
            <div className={style.passwordForm}>
              <form action="">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  className={style.changePasswordInput}
                  id="newPassword"
                />
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  className={style.changePasswordInput}
                  id="confirmPassword"
                />
              </form>
            </div>
            <div className={style.confirmationActions}>
              <button
                className={style.emailCancelButton}
                onClick={() => {
                  setShowChangePassword(false);
                  setPasswordError("");
                }}
              >
                Cancel
              </button>
              <button
                className={style.emailChangeButton}
                onClick={handleChangePassword}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}

      {showChangeUserId && (
        <div className={style.confirmationOverlay}>
          <div className={style.normalConfirmationDialog}>
            <h3 className={style.confirmationTitle}>Change User ID</h3>
            {userIdError && <p className={style.errorText}>{userIdError}</p>}
            <label htmlFor="newUserId">New User ID</label>
            <input
              type="text"
              className={style.changeEmailInput}
              id="newUserId"
            />
            <div className={style.confirmationActions}>
              <button
                className={style.emailCancelButton}
                onClick={() => {
                  setShowChangeUserId(false);
                  setUserIdError("");
                }}
              >
                Cancel
              </button>
              <button
                className={style.emailChangeButton}
                onClick={handleChangeUserId}
              >
                Change User ID
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
