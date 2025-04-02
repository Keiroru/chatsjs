"use client";

import { useState, useEffect, use, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import styles from "@/app/styles/friends.module.css";
import { useSocket } from "@/lib/socket";

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
  const socket = useSocket();

  const fetchLastMessages = useCallback(async () => {
    if (!userData?.userId) return;

    try {
      const response = await fetch(
        `/api/messages/lastMessages?userId=${userData.userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch last messages");
      const lastMessages = await response.json();

      if (lastMessages.length > 0) {
        setFriends((prevFriends) => {
          const updatedFriends = prevFriends.map((friend) => {
            const lastMessage = lastMessages.find(
              (msg) => msg.friendId === friend.userId && msg.conversationId
            );

            if (lastMessage) {
              return {
                ...friend,
                lastMessage: lastMessage.isDeleted
                  ? "This message was deleted"
                  : lastMessage.messageText,
                lastMessageAt: lastMessage.sentAt || null,
              };
            }
            return friend;
          });

          return [...updatedFriends].sort((a, b) => {
            const timeA = a.lastMessageAt
              ? new Date(a.lastMessageAt)
              : new Date(0);
            const timeB = b.lastMessageAt
              ? new Date(b.lastMessageAt)
              : new Date(0);
            return timeB - timeA;
          });
        });
      }
    } catch (error) {
      console.error("Error fetching last messages:", error);
    }
  }, [userData?.userId, setFriends]);

  const fetchPeople = useCallback(async () => {
    if (!userData?.userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/friends/list?userId=${userData.userId}&tab=${activeTab}`
      );
      if (!response.ok) throw new Error("Failed to fetch people");
      const data = await response.json();

      setFriends(data);
      setFilteredPeople(data);

      if (activeTab === "friends" || activeTab === "people") {
        await fetchLastMessages();
      }
    } catch (error) {
      console.error("Error fetching people:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [userData?.userId, activeTab, fetchLastMessages, setFriends]);

  useEffect(() => {
    let isActive = true;

    const fetchData = async () => {
      if (!isActive) return;
      await fetchPeople();
    };

    fetchData();

    return () => {
      isActive = false;
    };
  }, [userData?.userId, userData?.refreshTrigger, fetchPeople]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (newMessage) => {
      if (activeTab === "friends" || activeTab === "people") {
        fetchLastMessages();
      }
    };

    const handleReceiveRequest = (data) => {
      setFriends((prevFriends) => [...prevFriends, data]);
    };

    socket.on("receive_accept", handleReceiveRequest);
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("receive_accept", handleReceiveRequest);
    };
  }, [socket, activeTab, userData?.userId]);

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
