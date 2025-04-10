"use client";

import { useState } from "react";
import styles from "@/app/styles/addFriend.module.css";
import { useSocket } from "@/lib/socket";
import { useTranslation } from "@/contexts/TranslationContext";

export default function AddFriend({
  userId,
  addFriendTabOpen,
  setAddFriendTabOpen,
}) {
  const { t } = useTranslation();
  const [receiverUserName, setUsername] = useState("");
  const [receiverDisplayId, setReceiverDisplayId] = useState("");
  const [status, setStatus] = useState({ type: null, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTime, setLoadingTime] = useState(false);
  const Socket = useSocket();

  const handleAddFriend = async () => {
    if (!receiverDisplayId.trim() || !receiverUserName.trim()) return;

    setIsLoading(true);
    setLoadingTime(true);
    setStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/friends/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderUserId: userId,
          receiverUserName: receiverUserName,
          receiverDisplayId: receiverDisplayId,
        }),
      });

      const data = await response.json();

      const friendRequestData = {
        sender: userId,
        receiverUserId: data.receiverUserId
      };

      Socket.emit("friend_request", friendRequestData);

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Friend request sent successfully!",
        });
        setUsername("");
        setReceiverDisplayId("");
        setIsLoading(false);
        setTimeout(() => setStatus({ type: null, message: "" }), 5000);
      } else {
        setStatus({
          type: "error",
          message: data.error || "Failed to send friend request",
        });
        setIsLoading(false);
        setTimeout(() => setStatus({ type: null, message: "" }), 5000);
      }
    } catch (error) {
      console.error("Error adding friend:", error);
      setStatus({
        type: "error",
        message: "An error occurred. Please try again.",
      });
      setTimeout(() => setStatus({ type: null, message: "" }), 5000);
    } finally {
      setTimeout(() => {
        setLoadingTime(false);
        setStatus({ type: null, message: "" });
      }, 5000);
    }
  };

  const resetFields = () => {
    setUsername("");
    setReceiverDisplayId("");
  };

  return (
    <div className={styles.container}>
      {!addFriendTabOpen ? (
        <button onClick={setAddFriendTabOpen} className={styles.addButton}>
          {t("addFriend")}
        </button>
      ) : (
        <div>
          <div className={styles.searchContainer}>
            {status.message && (
              <div
                className={
                  status.type === "error"
                    ? styles.errorMessage
                    : styles.successMessage
                }
              >
                {status.message}
                {loadingTime && (
                  <div className={styles.loaderContainer}>
                    <div className={styles.loader}></div>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={() => {
                setAddFriendTabOpen();
                resetFields();
              }}
              className={styles.backButton}
            >
              {t("close")}
            </button>
            <div className={styles.searchFields}>
              <input
                type="text"
                maxLength="20"
                placeholder={t("usersname")}
                aria-label="User name"
                value={receiverUserName}
                onChange={(e) => setUsername(e.target.value)}
                className={`${styles.inputName} ${status.type === "error" ? styles.inputError : ""
                  }`}
              />
              <span className={styles.separator}>#</span>
              <input
                type="text"
                maxLength="4"
                placeholder="ID"
                aria-label="ID"
                value={receiverDisplayId}
                onChange={(e) => setReceiverDisplayId(e.target.value)}
                className={`${styles.inputId} ${status.type === "error" ? styles.inputError : ""
                  }`}
              />
            </div>
            <button
              onClick={handleAddFriend}
              className={styles.addButton}
              disabled={
                isLoading ||
                !receiverDisplayId.trim() ||
                !receiverUserName.trim()
              }
            >
              {isLoading ? t("sending") : t("sendRequest")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
