"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "@/app/styles/chat.module.css";
import Logout from "@/app/components/logout/logout";
import Friends from "@/app/components/friendList/friends";
import Settings from "@/app/components/settings/settings";
import AddFriend from "@/app/components/addFriend/addFriend";
import FriendRequests from "@/app/components/friendRequest/friendRequests";
import Messages from "@/app/components/messages/messages";
import {
  faArrowLeft,
  faPaperPlane,
  faTimes,
  faCog,
} from "@fortawesome/free-solid-svg-icons";

export default function ChatClient({ userData }) {
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [messageInput, setMessageInput] = useState("");

  const formattedDate = activeChat?.createdAt
    ? new Date(activeChat.createdAt)
        .toISOString()
        .split("T")[0]
        .replace(/-/g, ".")
    : "No contact selected";

  useEffect(() => {
    const checkMobile = () => {
      const mobileView = window.innerWidth <= 768;
      setIsMobile(mobileView);

      if (mobileView) {
        setLeftPanelOpen(true);
      }
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

  const toggleSettings = () => {
    setSettingsOpen((prev) => !prev);

    if (!settingsOpen) {
      setRightPanelOpen(false);
    }
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
            <Logout />

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
        <FriendRequests userData={userData} />

        <Friends
          userData={userData}
          activeChat={activeChat}
          onContactSelect={setActiveChat}
        />
      </aside>

      <main
        className={`${styles["chat-main"]} ${
          !leftPanelOpen || !isMobile ? styles["visible"] : ""
        }`}
      >
        {settingsOpen ? (
          <Settings userData={userData} />
        ) : (
          <>
            <header className={styles["chat-header"]}>
              {isMobile && (
                <button
                  className={`${styles["icon-button"]} ${styles["back-button"]}`}
                  onClick={handleBackToContacts}
                  aria-label="Back to contacts"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
              )}
              <button
                className={styles["contact-info-button"]}
                onClick={() => setRightPanelOpen(!rightPanelOpen)}
                aria-label="Toggle contact info"
              >
                <Image
                  src={
                    activeChat?.profilePicPath || "https://placehold.co/50x50"
                  }
                  alt="Contact avatar"
                  width={40}
                  height={40}
                  className={styles["avatar"]}
                />
                <h1>{activeChat?.displayName || "Select a contact"}</h1>
              </button>
            </header>

            <div className={styles["messages-container"]}>
              <Messages userData={userData} />
            </div>

            <div className={styles["message-input-container"]}>
              <textarea
                placeholder="Type a message"
                className={styles["message-input"]}
                aria-label="Type a message"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                disabled={!activeChat}
              />
              <button
                className={styles["send-button"]}
                aria-label="Send message"
                onClick={() => {
                  if (messageInput.trim() && activeChat) {
                    // Placeholder for sending message
                    console.log("Sending:", messageInput);
                    setMessageInput("");
                  }
                }}
                disabled={!activeChat || !messageInput.trim()}
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </>
        )}
      </main>

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

        <div className={styles["contact-profile"]}>
          <Image
            src={activeChat?.profilePicPath || "https://placehold.co/100x100"}
            alt="Contact profile"
            width={100}
            height={100}
            className={styles["profile-avatar"]}
          />
          <h2 className={styles["profile-name"]}>
            {activeChat?.displayName || "Select a contact"}
          </h2>
          <span
            className={`${styles["status-badge"]} ${
              activeChat?.status ? styles["online"] : styles["offline"]
            }`}
          >
            {activeChat?.status ? "Online" : "Offline"}
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
