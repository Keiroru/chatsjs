"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image"; // Add this import
import "./chat.css";
import LogoutButton from "./logout";
import ContactsList from "./contacts";
import AddFriendButton from "./addFriend";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faSearch,
  faCog,
  faPaperPlane,
  faTimes,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

export default function ChatClient({ userData }) {
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

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

  const handleContactClick = (contact) => {
    setActiveChat(contact);

    if (isMobile) {
      setLeftPanelOpen(false);
    }
  };

  const handleBackToContacts = () => {
    if (isMobile) {
      setLeftPanelOpen(true);
    }
  };

  return (
    <div className={`chat-container ${isMobile ? "mobile" : ""}`}>
      <aside
        className={`sidebar left-sidebar ${leftPanelOpen ? "open" : "closed"}`}
      >
        <header className="sidebar-header">
          <div className="user-info">
            {!leftPanelOpen && (
              <button
                className="icon-button"
                onClick={() => setLeftPanelOpen(true)}
                aria-label="Open contacts panel"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
            )}
            <Image
              src={userData?.avatar || "https://placehold.co/50x50"}
              alt="User avatar"
              width={40}
              height={40}
              className="avatar"
            />
            <h2 className="username">{userData?.displayName}</h2>
          </div>

          <div className="controls">
            <button className="icon-button" aria-label="Settings">
              <FontAwesomeIcon icon={faCog} />
            </button>
            <LogoutButton />
          </div>
        </header>

        <AddFriendButton userId={userData?.userId} />

        <ContactsList
          userId={userData?.userId}
          onContactSelect={handleContactClick}
          activeChat={activeChat}
        />
      </aside>

      <main
        className={`chat-main ${!leftPanelOpen || !isMobile ? "visible" : ""}`}
      >
        <header className="chat-header">
          {isMobile && (
            <button
              className="icon-button back-button"
              onClick={handleBackToContacts}
              aria-label="Back to contacts"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
          )}
          <button
            className="contact-info-button"
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
            aria-label="Toggle contact info"
          >
            <Image
              src={activeChat?.avatar || "https://placehold.co/50x50"}
              alt="Contact avatar"
              width={40}
              height={40}
              className="avatar"
            />
            <h1>{activeChat?.displayName || "Select a contact"}</h1>
          </button>
        </header>

        <div className="messages-container">
          <div className="no-chat-selected">
            <p>select someone bruh</p>
          </div>
        </div>

        <div className="message-input-container">
          <input
            type="text"
            placeholder="Type a message"
            className="message-input"
            aria-label="Type a message"
            disabled={!activeChat}
          />
          <button
            className="send-button"
            aria-label="Send message"
            disabled={!activeChat}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </main>

      <aside
        className={`sidebar right-sidebar ${rightPanelOpen ? "open" : ""}`}
      >
        <header className="sidebar-header">
          <button
            className="close-button icon-button"
            onClick={() => setRightPanelOpen(false)}
            aria-label="Close contact info"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <h2>Infok</h2>
        </header>

        <div className="contact-profile">
          <Image
            src={activeChat?.avatar || "https://placehold.co/100x100"}
            alt="Contact profile"
            width={100}
            height={100}
            className="profile-avatar"
          />
          <h2 className="profile-name">
            {activeChat?.displayName || "Select a contact"}
          </h2>
          <span
            className={`status-badge ${
              activeChat?.status ? "online" : "offline"
            }`}
          >
            {activeChat?.status ? "Online" : "Offline"}
          </span>
        </div>

        <div className="profile-details">
          <section className="profile-section">
            <h3 className="profile-section-title">Bio</h3>
            <p className="profile-section-content">{activeChat?.bio || ""}</p>
          </section>
          <section className="profile-section">
            <h3 className="profile-section-title">Created at</h3>
            <p className="profile-section-content">{formattedDate}</p>
          </section>
        </div>

        <div className="shared-media">
          <h3 className="shared-media-title">Shared stuff</h3>
          <div className="shared-media-content">
            <Image
              src="https://placehold.co/100x100"
              alt="Shared media"
              width={100}
              height={100}
              className="shared-img"
            />
            <Image
              src="https://placehold.co/100x100"
              alt="Shared media"
              width={100}
              height={100}
              className="shared-img"
            />
            <Image
              src="https://placehold.co/100x100"
              alt="Shared media"
              width={100}
              height={100}
              className="shared-img"
            />
            <Image
              src="https://placehold.co/100x100"
              alt="Shared media"
              width={100}
              height={100}
              className="shared-img"
            />
            <Image
              src="https://placehold.co/100x100"
              alt="Shared media"
              width={100}
              height={100}
              className="shared-img"
            />
            <Image
              src="https://placehold.co/100x100"
              alt="Shared media"
              width={100}
              height={100}
              className="shared-img"
            />
          </div>
        </div>
      </aside>
    </div>
  );
}
