"use client";

import { useState, useEffect, useCallback, act } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "@/app/styles/chat.module.css";
import Logout from "@/app/components/logout";
import PeopleList from "@/app/components/peopleList";
import AddFriend from "@/app/components/addFriend";
import FriendRequests from "@/app/components/friendRequests";
import Messages from "@/app/components/messages/messages";
import GroupChat from "@/app/components/createGroupChat";
import ContactInfo from "@/app/components/contactInfo";
import { faArrowLeft, faTimes, faCog } from "@fortawesome/free-solid-svg-icons";
import { useSocket } from "@/lib/socket";
import { useTranslation } from "@/contexts/TranslationContext";

export default function ChatClient({ userData }) {
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addFriendTabOpen, setAddFriendTabOpen] = useState(false);
  const [acceptRequestTabOpen, setAcceptRequestTabOpen] = useState(false);
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [canChat, setCanChat] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState([]);
  const [groupChatName, setGroupChatName] = useState(null);
  const [block, setBlock] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [editMessage, setEditMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("people");
  const [friendRequests, setFriendRequests] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const { t } = useTranslation();
  const socket = useSocket();

  const formattedDate = activeChat?.createdAt
    ? new Date(activeChat.createdAt)
      .toISOString()
      .split("T")[0]
      .replace(/-/g, ".")
    : "No contact selected";

  const fetchConversationId = useCallback(async () => {
    try {
      console.log("fetching conversationId:", activeChat, isGroupChat);
      const response = await fetch("/api/messages/conversationGet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId1: userData.userId,
          userId2: isGroupChat ? activeChat.conversationId : activeChat.userId,
          isGroupChat: isGroupChat,
        }),
      });
      const data = await response.json();
      if (response.ok && data.conversationId) {
        setConversationId(data.conversationId);
      } else {
        const response = await fetch("/api/messages/conversationCreate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId1: userData.userId,
            userId2: isGroupChat
              ? activeChat.conversationId
              : activeChat.userId,
            isGroupChat: isGroupChat,
          }),
        });
        const data = await response.json();
        console.log("conversationId:", data);

        if (response.ok) {
          setConversationId(data.conversationId);
          socket.emit("join_conversation", {
            conversationId: data.conversationId,
            userId: userData.userId,
          });
          socket.emit("otherJoin_conversation", {
            conversationId: data.conversationId,
            userId: activeChat.userId,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching conversationId:", error);
    }
  }, [activeChat]);

  const fetchAllConversations = async () => {
    const response = await fetch("/api/messages/getAllConversation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userData.userId,
      }),
    });
    const data = await response.json();
    socket.emit("joinAll_conversations", data.conversationIds);
  };

  useEffect(() => {
    if (!socket) return;
    fetchAllConversations();
  }, [socket]);

  const handleUnload = async () => {
    const res = await fetch(`/api/auth/unload?userId=${userData.userId}`, {
      method: "POST",
    });
    if (res.ok) {
      console.log("Unload successful");
    } else {
      console.error("Unload failed");
    }
  };

  const handleLoad = async () => {
    if (!userData?.userId) return;
    try {
      const res = await fetch(`/api/auth/load?userId=${userData.userId}`, {
        method: "POST",
      });
      if (res.ok) {
        console.log("Load successful");
        socket.emit("user_status", {
          userId: userData.userId,
          status: "online",
        });
      } else {
        console.error("Load failed");
      }
    } catch (error) {
      console.error("Error during load:", error);
    }
  };

  useEffect(() => {
    if (!socket || !userData?.userId) return;

    handleLoad();

    const handleBeforeUnload = () => {
      handleUnload();
      socket.emit("user_status", {
        userId: userData.userId,
        status: "offline",
      });
    };

    const handleFriendStatusChange = ({ userId, status }) => {
      setFriends((oldFriends) =>
        oldFriends.map((friend) =>
          friend.userId === userId
            ? {
              ...friend,
              status,
              isOnline: status === "online",
            }
            : friend
        )
      );

      setActiveChat((prevChat) => {
        if (prevChat && prevChat.userId === userId) {
          return {
            ...prevChat,
            isOnline: status === "online",
            status,
          };
        }
        return prevChat;
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    socket.on("friend_status_change", handleFriendStatusChange);

    return () => {
      if (socket && userData?.userId) {
        socket.emit("user_status", {
          userId: userData.userId,
          status: "offline",
        });
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
      socket.off("friend_status_change", handleFriendStatusChange);
    };
  }, [socket, userData?.userId]);

  useEffect(() => {
    const checkMobile = () => {
      const mobileView = window.innerWidth <= 576;

      if (mobileView) {
        setLeftPanelOpen(!activeChat);
        setIsMobile(true);
      } else {
        setIsMobile(false);
        setLeftPanelOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, [activeChat]);

  const handleBackToContacts = () => {
    if (isMobile) {
      setLeftPanelOpen(true);
    }
  };

  const toggleRightPanel = () => {
    setRightPanelOpen((prev) => !prev);
  };

  const toggleSettings = () => {
    setSettingsOpen((prev) => !prev);

    if (!settingsOpen) {
      setRightPanelOpen(false);
    }

    if (isMobile) {
      setLeftPanelOpen((prev) => !prev);
    }
  };

  const handleChatClick = (chatId, getGroupChat) => {
    setActiveChat({
      ...chatId,
      isOnline: chatId.isOnline,
      status: chatId.status,
    });

    if (settingsOpen) {
      setSettingsOpen(false);
    }
    if (isMobile) {
      setLeftPanelOpen(false);
    }
    if (getGroupChat) {
      setIsGroupChat(true);
    } else {
      setIsGroupChat(false);
    }
  };

  const refreshFriendsList = () => {
    setRefresh((prev) => prev + 1);
  };

  const handleAcceptRequestTabOpen = () => {
    setAcceptRequestTabOpen((prev) => !prev);
  };

  const handleAddFriendTabOpen = () => {
    setAddFriendTabOpen((prev) => !prev);
  };

  const handleSetGroupChatName = (name) => {
    setGroupChatName(name);
  };

  const fetchFriendRequests = async () => {
    if (!userData?.userId) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/friends/requests?receiverUserId=${userData.userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch friend requests");
      const data = await response.json();
      setFriendRequests(data);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`${styles["chat-container"]} ${isMobile ? styles["mobile"] : ""
        } ${rightPanelOpen ? styles["right-open"] : ""}`}
    >
      <aside
        className={`${styles["sidebar"]} ${styles["left-sidebar"]} ${leftPanelOpen ? styles["open"] : styles["closed"]
          }`}
      >
        <header className={styles["sidebar-header"]}>
          <div className={styles["user-info"]}>
            {!leftPanelOpen && (
              <button
                className={styles["icon-button"]}
                onClick={() => setLeftPanelOpen(true)}
                aria-label="Open contacts panel"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
            )}
            <div onClick={toggleSettings} className={styles.profileWrapper}>
              <Image
                src={
                  userData?.profilePicPath ||
                  "/images/user-icon-placeholder.png"
                }
                alt="User avatar"
                width={50}
                height={50}
                className={styles["avatar"]}
              />
              <h2 className={styles["username"]}>{userData?.displayName}</h2>
            </div>
          </div>

          <div className={styles["controls"]}>
            <Logout userId={userData?.userId} />

            <button
              className={styles["icon-button"]}
              aria-label="Settings"
              onClick={toggleSettings}
            >
              <FontAwesomeIcon icon={faCog} />
            </button>
          </div>
        </header>

        <PeopleList
          userData={{ ...userData, refreshTrigger: refresh }}
          activeChat={activeChat}
          onChatSelect={handleChatClick}
          messages={messages}
          friends={friends}
          setFriends={setFriends}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          block={block}
          setCanChat={setCanChat}
        />

        {activeTab === "groups" && (
          <GroupChat
            userData={userData}
            groupChatName={groupChatName}
            setGroupChatName={handleSetGroupChatName}
          />
        )}

        <div className={styles.friendControll}>
          {!acceptRequestTabOpen && (
            <AddFriend
              userId={userData.userId}
              addFriendTabOpen={addFriendTabOpen}
              setAddFriendTabOpen={handleAddFriendTabOpen}
            />
          )}
          {!addFriendTabOpen && (
            <FriendRequests
              userData={userData}
              onRequestAccept={refreshFriendsList}
              acceptRequestTabOpen={acceptRequestTabOpen}
              setAcceptRequestTabOpen={handleAcceptRequestTabOpen}
              friendRequests={friendRequests}
              setFriendRequests={setFriendRequests}
              fetchFriendRequests={fetchFriendRequests}
              setFriends={setFriends}
              activeTab={activeTab}
            />
          )}
        </div>
      </aside>

      <Messages
        userData={userData}
        isMobile={isMobile}
        activeChat={activeChat}
        isGroupChat={isGroupChat}
        onBackToContacts={handleBackToContacts}
        onToggleRightPanel={toggleRightPanel}
        toggleSettings={toggleSettings}
        rightPanelOpen={rightPanelOpen}
        settingsOpen={settingsOpen}
        messages={messages}
        setMessages={setMessages}
        setEditMessage={setEditMessage}
        editMessage={editMessage}
        setBlock={setBlock}
        block={block}
        fetchConversationId={fetchConversationId}
        conversationId={conversationId}
        setFriends={setFriends}
        canChat={canChat}
      />

      <aside
        className={`${styles["sidebar"]} ${styles["right-sidebar"]} ${rightPanelOpen ? styles["open"] : ""
          }`}
      >
        <ContactInfo
          setRightPanelOpen={setRightPanelOpen}
          rightPanelOpen={rightPanelOpen}
          activeChat={activeChat}
          isGroupChat={isGroupChat}
          formattedDate={formattedDate}
          userData={userData}
          conversationId={conversationId}
          fetchConversationId={fetchConversationId}
        />
      </aside>
    </div>
  );
}
