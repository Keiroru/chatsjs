"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import "./chat.css";
import LogoutButton from "./logout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSearch, faCog, faPaperPlane, faTimes, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function ChatClient({ userData }) {
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const chatContainerRef = useRef(null);

  const contacts = useMemo(() => [
    { id: 1, name: "cica", lastMessage: "snort it!", time: "14:39", avatar: "https://placehold.co/50x50", online: true },
    { id: 2, name: "help me", lastMessage: "propably would", time: "13:15", avatar: "https://placehold.co/50x50", online: false },
  ], []);

  const messages = useMemo(() => [
    { id: 1, sender: "other", text: "Cia cica", time: "14:35", avatar: "https://placehold.co/50x50" },
    { id: 2, sender: "other", text: "<3?", time: "14:36", avatar: "https://placehold.co/50x50" },
    { id: 3, sender: "me", text: "nope", time: "14:38", avatar: userData?.avatar || "https://placehold.co/50x50" },
  ], [userData?.avatar]);

  useEffect(() => {
    const checkMobile = () => {
      const mobileView = window.innerWidth <= 768;
      setIsMobile(mobileView);

      if (mobileView) {
        setLeftPanelOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
    <div className={`chat-container ${isMobile ? 'mobile' : ''}`}>
      <aside className={`sidebar left-sidebar ${leftPanelOpen ? 'open' : 'closed'}`}>
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
            <img
              src={userData?.avatar || "https://placehold.co/50x50"}
              alt=""
              className="avatar"
            />
            <h2 className="username">{userData?.displayName || "User"}</h2>
          </div>

          <div className="controls">
            <button className="icon-button" aria-label="Settings">
              <FontAwesomeIcon icon={faCog} />
            </button>
            <LogoutButton />
          </div>
        </header>

        <div className="search-container">
          <div className="search-input">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search contacts"
            />
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
          </div>
        </div>

        <div className="tab-buttons">
          <button className="tab-button active">People</button>
          <button className="tab-button">Groups</button>
        </div>

        <div className="contacts-list">
          {contacts.map(contact => (
            <button
              key={contact.id}
              className={`contact-item ${activeChat?.id === contact.id ? 'active' : ''}`}
              onClick={() => handleContactClick(contact)}
            >
              <img src={contact.avatar} alt="" className="avatar" />
              <div className="contact-info">
                <h3 className="contact-name">{contact.name}</h3>
                <p className="last-message">{contact.lastMessage}</p>
              </div>
              <span className="time">{contact.time}</span>
              <span className={`status-indicator ${contact.online ? 'online' : 'offline'}`}></span>
            </button>
          ))}
        </div>
      </aside>

      <main className={`chat-main ${!leftPanelOpen || !isMobile ? 'visible' : ''}`}>
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
            <img
              src={activeChat?.avatar || "https://placehold.co/50x50"}
              alt=""
              className="avatar"
            />
            <h1>{activeChat?.name || "Select a contact"}</h1>
          </button>
        </header>

        <div className="messages-container" ref={chatContainerRef}>
          {activeChat ? (
            messages.map(message => (
              <div
                key={message.id}
                className={`message ${message.sender === 'me' ? 'message-sent' : 'message-received'}`}
              >
                {message.sender !== 'me' && <img src={message.avatar} alt="" className="avatar" />}
                <div className="message-content">
                  <p className="message-text">{message.text}</p>
                  <span className="message-time">{message.time}</span>
                </div>
                {message.sender === 'me' && <img src={message.avatar} alt="" className="avatar" />}
              </div>
            ))
          ) : (
            <div className="no-chat-selected">
              <p>select someone bruh</p>
            </div>
          )}
        </div>

        <div className="message-input-container">
          <input
            type="text"
            placeholder="Type a message"
            className="message-input"
            aria-label="Type a message"
            disabled={!activeChat}
          />
          <button className="send-button" aria-label="Send message" disabled={!activeChat}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </main>

      <aside className={`sidebar right-sidebar ${rightPanelOpen ? 'open' : ''}`}>
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
          <img
            src={activeChat?.avatar || "https://placehold.co/100x100"}
            alt=""
            className="profile-avatar"
          />
          <h2 className="profile-name">{activeChat?.name || "Select a contact"}</h2>
          <span className={`status-badge ${activeChat?.online ? 'online' : 'offline'}`}>
            {activeChat?.online ? 'Online' : 'Offline'}
          </span>
        </div>

        <div className="profile-details">
          <section className="profile-section">
            <h3 className="profile-section-title">Bio</h3>
            <p className="profile-section-content">braindamaged</p>
          </section>
          <section className="profile-section">
            <h3 className="profile-section-title">Created at</h3>
            <p className="profile-section-content">123456789</p>
          </section>
        </div>

        <div className="shared-media">
          <h3 className="shared-media-title">Shared stuff</h3>
          <div className="shared-media-content">
            <img src="https://placehold.co/100x100" alt="" className="shared-img" />
            <img src="https://placehold.co/100x100" alt="" className="shared-img" />
            <img src="https://placehold.co/100x100" alt="" className="shared-img" />
            <img src="https://placehold.co/100x100" alt="" className="shared-img" />
            <img src="https://placehold.co/100x100" alt="" className="shared-img" />
            <img src="https://placehold.co/100x100" alt="" className="shared-img" />
          </div>
        </div>
      </aside>
    </div>
  );
}