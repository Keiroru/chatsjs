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
    let isActive = true;
    let messageInterval = null;

    async function fetchPeople() {
      if (!userData?.userId || !isActive) {
        if (isActive) setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/friends/list?userId=${userData.userId}&tab=${activeTab}`
        );
        if (!response.ok) throw new Error("Failed to fetch people");
        const data = await response.json();

        if (isActive) {
          setFriends(data);
          setFilteredPeople(data);
        }
      } catch (error) {
        if (isActive) {
          console.error("Error fetching people:", error);
          setError(error.message);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    async function fetchLastMessages() {
      if (!userData?.userId || !isActive) return;

      try {
        const response = await fetch(
          `/api/messages/lastMessages?userId=${userData.userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch last messages");
        const lastMessages = await response.json();

        if (isActive && lastMessages.length > 0) {
          setFriends((prevFriends) => {
            return prevFriends.map((friend) => {
              const lastMessage = lastMessages.find(
                (msg) => msg.userId === friend.userId
              );
              return {
                ...friend,
                lastMessage: lastMessage?.messageText || "No messages yet",
                lastMessageAt: lastMessage?.sentAt || null,
              };
            });
          });
        }
      } catch (error) {
        if (isActive) {
          console.error("Error fetching last messages:", error);
        }
      }
    }

    fetchPeople().then(() => {
      if (activeTab === "friends") {
        fetchLastMessages();
      }
    });

    if (activeTab === "friends" && userData?.userId) {
      messageInterval = setInterval(() => {
        fetchLastMessages();
      }, 3000);
    }

    return () => {
      isActive = false;
      if (messageInterval) {
        clearInterval(messageInterval);
      }
    };
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
    setError(null);
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
                  <div className={styles.messageRow}>
                    <p className={styles.lastMessage}>
                      {person.lastMessage || "No messages yet"}
                    </p>
                    {person.lastMessageAt && (
                      <span className={styles.messageTime}>
                        {new Date(person.lastMessageAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </span>
                    )}
                  </div>
                </div>
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
                key={`${group.conversationId}-${group.userId}`}
                className={`${styles.friendItem} ${
                  activeChat?.conversationId === group.conversationId
                    ? styles.active
                    : ""
                }`}
                onClick={() => handleChatClick(group, true)}
              >
                <Image
                  src={group?.profilePicPath || "https://placehold.co/50x50"}
                  alt="Group avatar"
                  width={40}
                  height={40}
                  className={styles.avatar}
                />
                <div className={styles.friendInfo}>
                  <h3 className={styles.friendName}>
                    {group.conversationName}
                  </h3>
                  <p className={styles.lastMessage}>
                    {group.lastMessage || "No messages yet"}
                    </p>
                  {group.lastMessageAt && (
                    <span className={styles.messageTime}>
                      {new Date(group.lastMessageAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </span>
                  )}
                </div>
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
                onClick={() => handleChatClick(friend)}
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
                  <div className={styles.messageRow}>
                    <p className={styles.lastMessage}>
                      {friend.lastMessage || "No messages yet"}
                    </p>
                    {friend.lastMessageAt && (
                      <span className={styles.messageTime}>
                        {new Date(friend.lastMessageAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </span>
                    )}
                  </div>
                </div>
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
