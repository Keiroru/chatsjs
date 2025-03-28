"use client";

import { useState } from "react";
import styles from "@/app/styles/addFriend.module.css";

export default function AddFriend({
  userId,
  addFriendTabOpen,
  setAddFriendTabOpen,
}) {
  const [receiverUserName, setUsername] = useState(""); // Input field for username
  const [receiverDisplayId, setReceiverDisplayId] = useState(""); // Receiver's userId
  const [status, setStatus] = useState({ type: null, message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleAddFriend = async () => {
    if (!receiverDisplayId.trim() || !receiverUserName.trim()) return;

    setIsLoading(true);
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

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Friend request sent successfully!",
        });
        setUsername("");
        setReceiverDisplayId("");
      } else {
        setStatus({
          type: "error",
          message: data.error || "Failed to send friend request",
        });
      }
    } catch (error) {
      console.error("Error adding friend:", error);
      setStatus({
        type: "error",
        message: "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {!addFriendTabOpen ? (
        <button onClick={setAddFriendTabOpen} className={styles.button}>
          Add a new friend
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
              </div>
            )}
            <button onClick={setAddFriendTabOpen} className={styles.button}>
              close
            </button>
            <div className={styles.searchFields}>
              <input
                type="text"
                maxLength="20"
                placeholder="User's name"
                aria-label="User name"
                value={receiverUserName}
                onChange={(e) => setUsername(e.target.value)}
                className={`${styles.inputName} ${
                  status.type === "error" ? styles.inputError : ""
                }`}
              />
              <span>#</span>
              <input
                type="text"
                maxLength="4"
                placeholder="ID"
                aria-label="ID"
                value={receiverDisplayId}
                onChange={(e) => setReceiverDisplayId(e.target.value)}
                className={`${styles.inputId} ${
                  status.type === "error" ? styles.inputError : ""
                }`}
              />
            </div>
            <button
              onClick={handleAddFriend}
              className={styles.button}
              disabled={
                isLoading ||
                !receiverDisplayId.trim() ||
                !receiverUserName.trim()
              }
            >
              {isLoading ? "Sending..." : "Send request"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
