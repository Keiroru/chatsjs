"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import styles from "@/app/styles/friends.module.css";
import { useSocket } from "@/lib/socket";

export default function Friends({
  userData,
  activeChat,
  onFriendSelect,
  friends,
  setFriends,
}) {
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("people");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !userData?.userId) return;

    socket.emit("user_status", {
      userId: userData.userId,
      status: "online",
    });

    const handleBeforeUnload = () => {
      socket.emit("user_status", {
        userId: userData.userId,
        status: "offline",
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    socket.on("friend_status_change", ({ userId, status }) => {
      console.log("Friend status change:", userId, status);
      setFriends((oldFriends) =>
        oldFriends.map((f) =>
          f.friendId === userId
            ? {
                ...f,
                status,
                isOnline: status === "online",
              }
            : f
        )
      );
    });

    return () => {
      if (socket && userData?.userId) {
        socket.emit("user_status", {
          userId: userData.userId,
          status: "offline",
        });
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
      socket.off("friend_status_change");
    };
  }, [socket, userData?.userId]);

  useEffect(() => {
    async function fetchFriends() {
      if (!userData?.userId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/friends/list?userId=${userData.userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch friends");
        const data = await response.json();
        setFriends(data);
        setFilteredFriends(data);
      } catch (error) {
        console.error("Error fetching friends:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFriends();
  }, [userData?.userId, userData?.refreshTrigger]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFriends(friends);
    } else {
      const filtered = friends.filter((friend) =>
        friend.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFriends(filtered);
    }
  }, [searchQuery, friends]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFriendClick = (friend) => {
    onFriendSelect(friend);
  };

  return (
    <>
      <div className={styles["search-container"]}>
        <div className={styles["search-input"]}>
          <input
            type="text"
            placeholder="Search Friends"
            value={searchQuery}
            onChange={handleSearch}
            aria-label="Search friends"
            className={styles["search-field"]}
          />
          {isLoading ? null : (
            <FontAwesomeIcon
              icon={faSearch}
              className={styles["search-icon"]}
            />
          )}
        </div>
      </div>

      <div className={styles["tab-buttons"]}>
        <button
          className={`${styles["tab-button"]} ${
            activeTab === "people" ? styles["active"] : ""
          }`}
          onClick={() => setActiveTab("people")}
        >
          Friends
        </button>
        <button
          className={`${styles["tab-button"]} ${
            activeTab === "groups" ? styles["active"] : ""
          }`}
          onClick={() => setActiveTab("groups")}
        >
          Groups
        </button>
      </div>

      <div className={styles["friends-list"]}>
        {isLoading ? (
          <div className={styles["loading-spinner"]}>Loading friends...</div>
        ) : error ? (
          <div className={styles["error-message"]}>Error: {error}</div>
        ) : filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <button
              key={friend.friendId}
              className={`${styles["friend-item"]} ${
                activeChat?.friendId === friend.friendId ? styles["active"] : ""
              }`}
              onClick={() => handleFriendClick(friend)}
            >
              <Image
                src={friend?.profilePicPath || "https://placehold.co/50x50"}
                alt="Friend avatar"
                width={40}
                height={40}
                className={styles["avatar"]}
              />
              <div className={styles["friend-info"]}>
                <h3 className={styles["friend-name"]}>{friend.displayName}</h3>
                <p className={styles["last-message"]}>
                  {friend.lastMessage || "Click to start chatting"}
                </p>
              </div>
              <span className={styles["time"]}>{friend.lastMessageTime}</span>
              <span
                className={`${styles["status-indicator"]} ${
                  friend.isOnline ? styles["online"] : styles["offline"]
                }`}
              ></span>
            </button>
          ))
        ) : (
          <div className={styles["no-friends"]}>No friends found</div>
        )}
      </div>
    </>
  );
}
