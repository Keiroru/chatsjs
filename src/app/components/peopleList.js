"use client";

import { useState, useEffect, use, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import styles from "@/app/styles/peopleList.module.css";
import { useSocket } from "@/lib/socket";
import { useTranslation } from "@/contexts/TranslationContext";

export default function PeopleList({
  userData,
  activeChat,
  onChatSelect,
  friends,
  setFriends,
  activeTab,
  setActiveTab,
  block,
  setCanChat,
}) {
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    message: null,
  });
  const [peopleContextMenu, setPeopleContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    friend: null,
  });
  const socket = useSocket();

  const fetchLastMessages = useCallback(async () => {
    if (!userData?.userId) return;

    try {
      const response = await fetch(
        `/api/messages/lastMessages?userId=${userData.userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch last messages");
      const lastMessages = await response.json();

      const unreadResponse = await fetch(
        `/api/messages/unreadCount?userId=${userData.userId}`
      );
      if (!unreadResponse.ok) throw new Error("Failed to fetch unread counts");
      const unreadCounts = await unreadResponse.json();

      if (lastMessages.length > 0) {
        setFriends((prevFriends) => {
          const updatedFriends = prevFriends.map((friend) => {
            const lastMessage = lastMessages.find(
              (msg) => msg.friendId === friend.userId && msg.conversationId
            );

            const unreadCount = unreadCounts.find(
              (count) => count.friendId === friend.userId
            )?.count;

            if (lastMessage) {
              return {
                ...friend,
                lastMessage:
                  lastMessage.isDeleted === 1
                    ? "deletedMessage"
                    : lastMessage.messageText,
                lastMessageAt: lastMessage.sentAt,
                lastMessageState: lastMessage.state,
                lastMessageSenderId: lastMessage.senderUserId,
                unreadCount: unreadCount,
              };
            }
            return {
              ...friend,
              unreadCount: unreadCount,
            };
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
      if (activeTab === "friends") {
        if (data.sender.userId === userData.userId) {
          setFriends((prevFriends) => [...prevFriends, data.receiver]);
          fetchLastMessages();
        } else if (data.receiver.userId === userData.userId) {
          setFriends((prevFriends) => [...prevFriends, data.sender]);
          fetchLastMessages();
        }
      }
    };

    const handleDeletefriend = (data) => {
      setFriends((prevFriends) =>
        prevFriends.filter((friend) => friend.userId !== data.deleter)
      );
    };

    const handleMessageStateUpdate = (data) => {
      if (activeTab === "friends" || activeTab === "people") {
        setFriends((prevFriends) => {
          return prevFriends.map((friend) => {
            if (
              friend.lastMessageSenderId === data.senderId &&
              friend.lastMessageState === "sent"
            ) {
              return {
                ...friend,
                lastMessageState: data.state,
              };
            }
            return friend;
          });
        });
      }
    };

    const handleMessageSeen = (data) => {
      if (activeTab === "friends" || activeTab === "people") {
        fetchLastMessages();
      }
    };

    const handleRenderGroupChat = (data) => {
      if (activeTab === "groups") {
        setFriends((prevFriends) => {
          const exists = prevFriends.some(group => group.conversationId === data.conversationId);
          if (!exists) {
            return [{
              conversationId: data.conversationId,
              conversationName: data.conversationName,
              createdAt: data.createdAt
            }, ...prevFriends];
          }
          return prevFriends;
        });
      }
    };

    socket.on("receive_accept", handleReceiveRequest);
    socket.on("render_group_chat", handleRenderGroupChat);
    socket.on("receive_message", handleReceiveMessage);
    socket.on("friend_delete", handleDeletefriend);
    socket.on("delete", fetchLastMessages);
    socket.on("receive_edit", fetchLastMessages);
    socket.on("message_state_update", handleMessageStateUpdate);
    socket.on("message_seen", handleMessageSeen);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("receive_accept", handleReceiveRequest);
      socket.off("friend_delete", handleDeletefriend);
      socket.off("delete", fetchLastMessages);
      socket.off("receive_edit", fetchLastMessages);
      socket.off("message_state_update", handleMessageStateUpdate);
      socket.off("message_seen", handleMessageSeen);
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
    setFriends((prevFriends) => {
      return prevFriends.map((friend) => {
        if (friend.userId === chatId.userId) {
          return {
            ...friend,
            unreadCount: 0,
          };
        }
        return friend;
      });
    });
  };

  const handleTabChange = (tab) => {
    setError(null);
    setActiveTab(tab);
  };

  const handleFriendDelete = async (friend) => {
    try {
      const response = await fetch("/api/friends/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData.userId,
          friendId: friend.userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete friend");
      }

      socket.emit("delete_friend", {
        deleter: userData.userId,
        deleted: friend.userId,
      });

      setFriends((prevFriends) =>
        prevFriends.filter((f) => f.userId !== contextMenu.message.userId)
      );
    } catch (error) {
      console.error("Error deleting friend:", error);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      const friendMenuElement = document.querySelector(`.${styles.menu}`);
      const isFriendMenuClick =
        friendMenuElement && friendMenuElement.contains(event.target);

      if (!isFriendMenuClick) {
        if (contextMenu.visible) {
          setContextMenu({ ...contextMenu, visible: false });
        }

        if (peopleContextMenu.visible) {
          setPeopleContextMenu({ ...peopleContextMenu, visible: false });
        }
      }
    }

    if (contextMenu.visible || peopleContextMenu.visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenu.visible, peopleContextMenu.visible]);

  const handleBlockFriend = async (friend) => {
    try {
      const response = await fetch("/api/friends/block", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData.userId,
          friendId: friend.userId,
        }),
      });

      const result = await response.json();
      socket.emit("block_friend", {
        blocker: result.blockerId,
        blocked: result.blockedId,
      });
    } catch (error) {
      console.error("Error blocking friend:", error);
    }
  };

  const handleUnblockFriend = async (friend) => {
    try {
      const response = await fetch("/api/friends/unblock", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData.userId,
          friendId: friend.userId,
        }),
      });

      socket.emit("unblock_friend", {
        unBlocker: userData.userId,
        unBlocked: friend.userId,
      });
    } catch (error) {
      console.error("Error unblocking friend:", error);
    }
  };

  const handleAddFriend = async (friend) => {
    try {
      const response = await fetch("/api/friends/addById", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData.userId,
          friendId: friend.userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add friend");
      }

      socket.emit("friend_request", {
        senderUserId: userData.userId,
        receiverUserId: friend.userId,
      });
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  return (
    <>
      <div className={styles.searchContainer}>
        <div className={styles.searchInput}>
          <input
            type="text"
            placeholder={t("search")}
            value={searchQuery}
            onChange={handleSearch}
            aria-label={t("search")}
            className={styles.searchField}
          />
          {isLoading ? null : (
            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          )}
        </div>
      </div>

      <div className={styles.tabButtons}>
        <button
          className={`${styles.tabButton} ${activeTab === "people" ? styles.active : ""
            }`}
          onClick={() => handleTabChange("people")}
        >
          {t("people")}
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "friends" ? styles.active : ""
            }`}
          onClick={() => handleTabChange("friends")}
        >
          {t("friends")}
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "groups" ? styles.active : ""
            }`}
          onClick={() => handleTabChange("groups")}
        >
          {t("groups")}
        </button>
      </div>

      <div
        onContextMenu={(e) => {
          e.preventDefault();
        }}
        className={styles.friendsList}
      >
        {isLoading ? (
          <div className={styles.loadingSpinner}>Loading...</div>
        ) : error ? (
          <div className={styles.errorMessage}>Error: {error}</div>
        ) : filteredPeople.length > 0 ? (
          activeTab === "people" ? (
            filteredPeople.map((person, key) => (
              <button
                key={`${person.userId}-${key}`}
                className={`${styles.friendItem} ${activeChat?.userId === person.userId ? styles.active : ""
                  }`}
                onClick={() => {
                  handleChatClick(person, false);
                  setCanChat(false);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setPeopleContextMenu({
                    visible: true,
                    x: e.pageX,
                    y: e.pageY,
                    friend: person,
                  });
                  console.log("People context menu:", peopleContextMenu);
                }}
              >
                <Image
                  src={
                    person?.profilePicPath ||
                    "/images/user-icon-placeholder.png"
                  }
                  alt="Friend avatar"
                  width={40}
                  height={40}
                  className={styles.avatar}
                />
                <div className={styles.friendInfo}>
                  <h3 className={styles.friendName}>
                    {person.displayName}
                    {person.unreadCount > 0 && (
                      <span className={styles.unreadBadge}>
                        {person.unreadCount > 99 ? "99+" : person.unreadCount}
                      </span>
                    )}
                  </h3>
                  <div className={styles.messageRow}>
                    <p className={styles.lastMessage}>
                      {person.lastMessage === "deletedMessage"
                        ? t("deletedMessage")
                        : person.lastMessage || t("noMessages")}
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
                  className={`${styles.statusIndicator} ${person.isOnline ? styles.online : styles.offline
                    }`}
                ></span>
              </button>
            ))
          ) : activeTab === "groups" ? (
            filteredPeople.map((group, key) => (
              <button
                key={`${group.conversationId}-${key}`}
                className={`${styles.friendItem} ${activeChat?.conversationId === group.conversationId
                  ? styles.active
                  : ""
                  }`}
                onClick={() => {
                  handleChatClick(group, true);
                  setCanChat(true);
                }}
              >
                <Image
                  src={
                    group?.profilePicPath ||
                    "/images/groupchat-icon-placeholder.png"
                  }
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
                    {group.lastMessage === "deletedMessage"
                      ? t("deletedMessage")
                      : group.lastMessage || t("noMessages")}
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
            filteredPeople.map((friend, key) => (
              <button
                key={`${friend.userId}-${key}`}
                className={`${styles.friendItem} ${activeChat?.userId === friend.userId ? styles.active : ""
                  }`}
                onClick={() => {
                  handleChatClick(friend);
                  setCanChat(true);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({
                    visible: true,
                    x: e.pageX,
                    y: e.pageY,
                    message: friend,
                  });
                }}
              >
                <Image
                  src={
                    friend?.profilePicPath ||
                    "/images/user-icon-placeholder.png"
                  }
                  alt="Friend avatar"
                  width={40}
                  height={40}
                  className={styles.avatar}
                />
                <div className={styles.friendInfo}>
                  <h3 className={styles.friendName}>
                    {friend.displayName}
                    {friend.unreadCount > 0 && (
                      <span className={styles.unreadBadge}>
                        {friend.unreadCount > 99 ? "99+" : friend.unreadCount}
                      </span>
                    )}
                  </h3>
                  <div className={styles.messageRow}>
                    <p className={styles.lastMessage}>
                      {friend.lastMessage === "deletedMessage"
                        ? t("deletedMessage")
                        : friend.lastMessage || t("noMessages")}
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
                  className={`${styles.statusIndicator} ${friend.isOnline ? styles.online : styles.offline
                    }`}
                ></span>
              </button>
            ))
          )
        ) : (
          <div className={styles.noFriends}>
            {activeTab === "groups"
              ? t("noGroups")
              : t("noFriends")}
          </div>
        )}

        {peopleContextMenu.visible && (
          <div
            className={styles.menu}
            style={{
              position: "fixed",
              top: `${peopleContextMenu.y}px`,
              left: `${peopleContextMenu.x}px`,
            }}
          >
            <div className={styles.menuHeader}>{t("actions")}</div>
            <button
              className={styles.menuItem}
              onClick={() => {
                setPeopleContextMenu({ ...peopleContextMenu, visible: false });
                handleAddFriend(peopleContextMenu.friend);
              }}
            >
              {t("addFriend")}
            </button>
          </div>
        )}
        {contextMenu.visible && (
          <div
            className={styles.menu}
            style={{
              position: "fixed",
              top: `${contextMenu.y}px`,
              left: `${contextMenu.x}px`,
            }}
          >
            <div className={styles.menuHeader}>{t("actions")}</div>

            <button
              className={styles.menuItem}
              onClick={() => {
                if (block?.blocked === contextMenu.message.userId) {
                  handleUnblockFriend(contextMenu.message);
                } else {
                  handleBlockFriend(contextMenu.message);
                }
                setContextMenu({ ...contextMenu, visible: false });
              }}
            >
              {block?.blocked === contextMenu.message.userId
                ? t("unblock")
                : t("block")}
            </button>

            <button
              className={`${styles.menuItem} ${styles.menuItem}`}
              onClick={() => {
                handleFriendDelete(contextMenu.message);
                setContextMenu({ ...contextMenu, visible: false });
              }}
            >
              {t("removeFriend")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
