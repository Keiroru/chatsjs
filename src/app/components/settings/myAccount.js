"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import style from "@/app/styles/account.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "@/contexts/TranslationContext";

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
  const { t } = useTranslation();

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
      userData.isLookingForFriends === newValue;
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
      <h1 className={style.accountTitle}>{t("account")}</h1>
      <p className={style.accountDescription}>
        {t("accountDescription")}
      </p>

      <div className={style.accountSection}>
        <h2 className={style.accountSectionTitle}>{t("accountInformation")}</h2>
        <div className={style.accountGrid}>
          <div
            className={`${style.accountGridItem} ${style.accountGridHeader}`}
          >
            {t("email")}
          </div>
          <div className={style.accountGridItem}>{userData.email}</div>
          <div className={style.accountGridItem}>
            <button
              onClick={() => setShowChangeEmail(true)}
              className={style.defaultButton}
            >
              {t("changeEmail")}
            </button>
          </div>

          <div
            className={`${style.accountGridItem} ${style.accountGridHeader}`}
          >
            {t("userId")}
          </div>
          <div className={style.accountGridItem}>#{userData.displayId}</div>
          <div className={style.accountGridItem}>
            <button
              onClick={() => setShowChangeUserId(true)}
              className={style.defaultButton}
            >
              {t("changeUserId")}
            </button>
          </div>

          <div
            className={`${style.accountGridItem} ${style.accountGridHeader}`}
          >
            {t("password")}
          </div>
          <div className={style.accountGridItem}>••••••••</div>
          <div className={style.accountGridItem}>
            <button
              onClick={() => setShowChangePassword(true)}
              className={style.defaultButton}
            >
              {t("changePassword")}
            </button>
          </div>

          <div
            className={`${style.accountGridItem} ${style.accountGridHeader}`}
          >
            {t("memberSince")}
          </div>
          <div className={style.accountGridItem}>
            {new Date(userData.createdAt).toLocaleDateString()}
          </div>
          <div className={style.accountGridItem}></div>
        </div>
      </div>

      <div className={style.lookingForFriends}>
        <h2 className={style.lookingForFriendsTitle}>{t("friendPreferences")}</h2>
        <div className={style.lookingForFriendsStatus}>
          <span className={style.statusLabel}>{t("lookingForFriends")}:</span>
          <span className={style.statusValue}>
            {lookingForFriends === 1 ? t("yes") : t("no")}
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
            ? t("stopLookingForFriends")
            : t("startLookingForFriends")}
        </button>
      </div>

      <div className={style.deleteAccountSection}>
        <h2 className={style.deleteAccountTitle}>{t("dangerZone")}</h2>
        <p className={style.deleteAccountDescription}>
          {t("deleteAccountDescription")}
        </p>
        <button
          className={style.deleteAccountButton}
          onClick={() => setShowDeleteConfirmation(true)}
        >
          <FontAwesomeIcon icon={faTrash} /> {t("deleteAccount")}
        </button>
      </div>

      {showDeleteConfirmation && (
        <div className={style.confirmationOverlay}>
          <div className={style.confirmationDialog}>
            <h3 className={style.confirmationTitle}>{t("confirm")}</h3>
            <p className={style.confirmationMessage}>
              {t("deleteAccountConfirmation")}
            </p>
            <div className={style.confirmationActions}>
              <button
                className={style.cancelButton}
                onClick={() => setShowDeleteConfirmation(false)}
              >
                {t("cancel")}
              </button>
              <button
                className={style.confirmDeleteButton}
                onClick={handleDeleteAccount}
              >
                <FontAwesomeIcon icon={faTrash} /> {t("deleteAccount")}
              </button>
            </div>
          </div>
        </div>
      )}

      {showChangeEmail && (
        <div className={style.confirmationOverlay}>
          <div className={style.normalConfirmationDialog}>
            <h3 className={style.confirmationTitle}>{t("changeEmail")}</h3>
            {emailError && <p className={style.errorText}>{emailError}</p>}
            <label htmlFor="newEmail">{t("newEmail")}</label>
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
                {t("cancel")}
              </button>
              <button
                className={style.emailChangeButton}
                onClick={handleChangeEmail}
              >
                {t("changeEmail")}
              </button>
            </div>
          </div>
        </div>
      )}

      {showChangePassword && (
        <div className={style.confirmationOverlay}>
          <div className={style.normalConfirmationDialog}>
            <h3 className={style.confirmationTitle}>{t("changePassword")}</h3>
            {passwordError && (
              <p className={style.errorText}>{passwordError}</p>
            )}
            <div className={style.passwordForm}>
              <form action="">
                <label htmlFor="newPassword">{t("newPassword")}</label>
                <input
                  type="password"
                  className={style.changePasswordInput}
                  id="newPassword"
                />
                <label htmlFor="confirmPassword">{t("confirmNewPassword")}</label>
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
                {t("cancel")}
              </button>
              <button
                className={style.emailChangeButton}
                onClick={handleChangePassword}
              >
                {t("changePassword")}
              </button>
            </div>
          </div>
        </div>
      )}

      {showChangeUserId && (
        <div className={style.confirmationOverlay}>
          <div className={style.normalConfirmationDialog}>
            <h3 className={style.confirmationTitle}>{t("changeUserId")}</h3>
            {userIdError && <p className={style.errorText}>{userIdError}</p>}
            <label htmlFor="newUserId">{t("newUserId")}</label>
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
                {t("cancel")}
              </button>
              <button
                className={style.emailChangeButton}
                onClick={handleChangeUserId}
              >
                {t("changeUserId")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
