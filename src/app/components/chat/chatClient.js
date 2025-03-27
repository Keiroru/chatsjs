"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "@/app/styles/chat.module.css";
import Logout from "@/app/components/logout/logout";
import Friends from "@/app/components/friendList/friends";
import AddFriend from "@/app/components/addFriend/addFriend";
import FriendRequests from "@/app/components/friendRequest/friendRequests";
import Messages from "@/app/components/messages/messages";
import { faArrowLeft, faTimes, faCog } from "@fortawesome/free-solid-svg-icons";
import { useSocket } from "@/lib/socket";

export default function ChatClient({ userData }) {
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState([]);
  const socket = useSocket();

  const formattedDate = activeChat?.createdAt
    ? new Date(activeChat.createdAt)
        .toISOString()
        .split("T")[0]
        .replace(/-/g, ".")
    : "No contact selected";

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
    const checkMobile = () => {
      const mobileView = window.innerWidth <= 576;
      setIsMobile(mobileView);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleBackToContacts = () => {
    if (isMobile) {
      setLeftPanelOpen(true);
    }
  };

  const toggleRightPanel = () => {
    setRightPanelOpen(!rightPanelOpen);
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

  const handleFriendClick = (friend) => {
    setActiveChat(friend);
    if (settingsOpen) {
      setSettingsOpen(false);
    }
    if (isMobile) {
      setLeftPanelOpen(false);
    }
  };

  const refreshFriendsList = () => {
    setRefresh((prev) => prev + 1);
  };

  return (
    <div
      className={`${styles["chat-container"]} ${
        isMobile ? styles["mobile"] : ""
      }`}
    >
      <aside
        className={`${styles["sidebar"]} ${styles["left-sidebar"]} ${
          leftPanelOpen ? styles["open"] : styles["closed"]
        }`}
      >
        <header className={styles["sidebar-header"]}>
          <div className={styles["user-info"]} onClick={toggleSettings}>
            {!leftPanelOpen && (
              <button
                className={styles["icon-button"]}
                onClick={() => setLeftPanelOpen(true)}
                aria-label="Open contacts panel"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
            )}
            <Image
              src={userData?.profilePicPath || "https://placehold.co/50x50"}
              alt="User avatar"
              width={50}
              height={50}
              className={styles["avatar"]}
            />
            <h2 className={styles["username"]}>{userData?.displayName}</h2>
          </div>

          <div className={styles["controls"]}>
            <Logout userId={userData.userId} />

            <button
              className={styles["icon-button"]}
              aria-label="Settings"
              onClick={toggleSettings}
            >
              <FontAwesomeIcon icon={faCog} />
            </button>
          </div>
        </header>

        <AddFriend userId={userData.userId} />
        <FriendRequests
          userData={userData}
          onRequestAccept={refreshFriendsList}
        />

        <Friends
          userData={{ ...userData, refreshTrigger: refresh }}
          activeChat={activeChat}
          onFriendSelect={handleFriendClick}
          messages={messages}
          friends={friends}
          setFriends={setFriends}
        />
      </aside>

      <Messages
        userData={userData}
        isMobile={isMobile}
        activeChat={activeChat}
        onBackToContacts={handleBackToContacts}
        onToggleRightPanel={toggleRightPanel}
        toggleSettings={toggleSettings}
        rightPanelOpen={rightPanelOpen}
        settingsOpen={settingsOpen}
        messages={messages}
        setMessages={setMessages}
      />

      <aside
        className={`${styles["sidebar"]} ${styles["right-sidebar"]} ${
          rightPanelOpen ? styles["open"] : ""
        }`}
      >
        <header className={styles["sidebar-header"]}>
          <button
            className={`${styles["close-button"]} ${styles["icon-button"]}`}
            onClick={() => setRightPanelOpen(false)}
            aria-label="Close contact info"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <h2>Contact Info</h2>
        </header>

        <div className={styles["contact-profile-container"]}>
          <Image
            src={activeChat?.profilePicPath || "https://placehold.co/100x100"}
            alt="Contact profile"
            width={125}
            height={125}
            className={styles["contact-profile"]}
          />
          <h2 className={styles["profile-name"]}>
            {activeChat?.displayName || "Select a contact"}
          </h2>
          <span className={styles.profileId}>#{activeChat?.displayId}</span>
          <span
            className={`${styles["status-badge"]} ${
              activeChat?.isOnline ? styles["online"] : styles["offline"]
            }`}
          >
            {activeChat?.isOnline ? "Online" : "Offline"}
          </span>
        </div>

        <div className={styles["profile-details"]}>
          <section className={styles["profile-section"]}>
            <h3 className={styles["profile-section-title"]}>Bio</h3>
            <p className={styles["profile-section-content"]}>
              {activeChat?.bio || "No bio available"}
            </p>
          </section>
          <section className={styles["profile-section"]}>
            <h3 className={styles["profile-section-title"]}>Created at</h3>
            <p className={styles["profile-section-content"]}>{formattedDate}</p>
          </section>
        </div>
      </aside>
    </div>
  );
}
