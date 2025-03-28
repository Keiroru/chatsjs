"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import styles from "@/app/styles/friends.module.css";
import { useStatus } from "@/lib/socket";

export default function Friends({
  userData,
  activeChat,
  onFriendSelect,
  friends,
  setFriends,
}) {
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("friends");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, [userData?.userId, userData?.refreshTrigger, setFriends]);

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
      <div className={styles.searchContainer}>
        <div className={styles.searchInput}>
          <input
            type="text"
            placeholder="Search someone"
            value={searchQuery}
            onChange={handleSearch}
            aria-label="Search someone"
            className={styles.searchField}
          />
          {isLoading ? null : (
            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          )}
        </div>
      </div>

      <div className={styles.tabButtons}>
        <button
          className={`${styles.tabButton} ${
            activeTab === "people" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("people")}
        >
          People
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "friends" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("friends")}
        >
          Friends
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "groups" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("groups")}
        >
          Groups
        </button>
      </div>

      <div className={styles.friendsList}>
        {isLoading ? (
          <div className={styles.loadingSpinner}>Loading friends...</div>
        ) : error ? (
          <div className={styles.errorMessage}>Error: {error}</div>
        ) : filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <button
              key={friend.friendId}
              className={`${styles.friendItem} ${
                activeChat?.friendId === friend.friendId ? styles.active : ""
              }`}
              onClick={() => handleFriendClick(friend)}
            >
              <Image
                src={friend?.profilePicPath || "https://placehold.co/50x50"}
                alt="Friend avatar"
                width={40}
                height={40}
                className={styles.avatar}
              />
              <div className={styles.friendInfo}>
                <h3 className={styles.friendName}>{friend.displayName}</h3>
                <p className={styles.lastMessage}>
                  {friend.lastMessage || "Click to start chatting"}
                </p>
              </div>
              <span className={styles.time}>{friend.lastMessageTime}</span>
              <span
                className={`${styles.statusIndicator} ${
                  friend.isOnline ? styles.online : styles.offline
                }`}
              ></span>
            </button>
          ))
        ) : (
          <div className={styles.noFriends}>No friends found</div>
        )}
      </div>
    </>
  );
}
