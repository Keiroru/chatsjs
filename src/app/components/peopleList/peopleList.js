"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import styles from "@/app/styles/friends.module.css";

export default function PeopleList({
  userData,
  activeChat,
  onChatSelect,
  friends,
  setFriends,
  activeTab,
  setActiveTab,
}) {
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPeople() {
      if (!userData?.userId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/friends/list?userId=${userData.userId}&tab=${activeTab}`
        );
        if (!response.ok) throw new Error("Failed to fetch friends");
        const data = await response.json();
        setFriends(data);
        setFilteredPeople(data);
      } catch (error) {
        console.error("Error fetching friends:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPeople();
  }, [userData?.userId, userData?.refreshTrigger, setFriends, activeTab]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPeople(friends);
    } else {
      const filtered = friends.filter((friend) =>
        friend.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPeople(filtered);
    }
  }, [searchQuery, friends]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleChatClick = (chatId, isGroupChat) => {
    onChatSelect(chatId, isGroupChat);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
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
          onClick={() => handleTabChange("people")}
        >
          People
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "friends" ? styles.active : ""
          }`}
          onClick={() => handleTabChange("friends")}
        >
          Friends
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "groups" ? styles.active : ""
          }`}
          onClick={() => handleTabChange("groups")}
        >
          Groups
        </button>
      </div>

      <div className={styles.friendsList}>
        {isLoading ? (
          <div className={styles.loadingSpinner}>Loading friends...</div>
        ) : error ? (
          <div className={styles.errorMessage}>Error: {error}</div>
        ) : filteredPeople.length > 0 ? (
          activeTab === "people" ? (
            filteredPeople.map((person) => (
              <button
                key={person.userId}
                className={`${styles.friendItem} ${
                  activeChat?.userId === person.userId ? styles.active : ""
                }`}
                onClick={() => handleChatClick(person, false)}
              >
                <Image
                  src={person?.profilePicPath || "https://placehold.co/50x50"}
                  alt="Friend avatar"
                  width={40}
                  height={40}
                  className={styles.avatar}
                />
                <div className={styles.friendInfo}>
                  <h3 className={styles.friendName}>{person.displayName}</h3>
                  <p className={styles.lastMessage}>
                    {person.lastMessage || "Click to start chatting"}
                  </p>
                </div>
                <span className={styles.time}>{person.lastMessageTime}</span>
                <span
                  className={`${styles.statusIndicator} ${
                    person.isOnline ? styles.online : styles.offline
                  }`}
                ></span>
              </button>
            ))
          ) : activeTab === "groups" ? (
            filteredPeople.map((group) => (
              <button
                key={group.conversationId}
                className={`${styles.friendItem} ${
                  activeChat?.conversationId === group.conversationId
                    ? styles.active
                    : ""
                }`}
                onClick={() => handleChatClick(group, true)}
              >
                <Image
                  src={group?.profilePicPath || "https://placehold.co/50x50"}
                  alt="Friend avatar"
                  width={40}
                  height={40}
                  className={styles.avatar}
                />
                <div className={styles.friendInfo}>
                  <h3 className={styles.friendName}>
                    {group.conversationName}
                  </h3>
                  <p className={styles.lastMessage}>
                    {group.lastMessage || "Click to start chatting"}
                  </p>
                </div>
                <span className={styles.time}>{group.lastMessageTime}</span>
              </button>
            ))
          ) : (
            activeTab === "friends" &&
            filteredPeople.map((friend) => (
              <button
                key={friend.userId}
                className={`${styles.friendItem} ${
                  activeChat?.userId === friend.userId ? styles.active : ""
                }`}
                onClick={() => handleChatClick(friend, false)}
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
          )
        ) : (
          <div className={styles.noFriends}>No friends found</div>
        )}
      </div>
    </>
  );
}
