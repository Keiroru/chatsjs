import { useState, useEffect } from "react";
import Image from "next/image";
import Settings from "@/app/components/settings/settings";
import styles from "@/app/styles/chat.module.css";
import {
  faArrowLeft,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Messages({
  userData,
  isMobile,
  activeChat,
  onBackToContacts,
  onToggleRightPanel,
}) {
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  useEffect(() => {
    if (activeChat && userData) {
      fetchConversationId();
    }
  }, [activeChat, userData]);

  const fetchConversationId = async () => {
    if (!activeChat?.userId || !userData?.userId) return;

    try {
      const response = await fetch('/api/messages/conversationID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId1: userData.userId,
          userId2: activeChat.userId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.conversationId) {
        setConversationId(data.conversationId);
      } else {
        console.error("Failed to get conversation ID:", data.error);
      }
    }
    catch (error) {
      console.error("Error fetching conversationId:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !conversationId) return;

    setLoading(true);

    try {
      const response = await fetch("/api/messages/postMessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: conversationId,
          senderUserId: userData.userId,
          messageText: messageInput,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prevMessages => [...prevMessages, data.data]);
        setMessageInput("");
      } else {
        console.error("Failed to send message:", data.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`${styles["chat-main"]} ${!isMobile ? styles["visible"] : ""}`}
    >
      <>
        <header className={styles["chat-header"]}>
          {isMobile && (
            <button
              className={`${styles["icon-button"]} ${styles["back-button"]}`}
              onClick={onBackToContacts}
              aria-label="Back to contacts"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
          )}
          <button
            className={styles["contact-info-button"]}
            onClick={onToggleRightPanel}
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
          {messages.length > 0 ? (
            messages.map(message => (
              <div
                key={message.messageId}
                className={`${styles.message} ${message.senderUserId === userData.userId
                  ? styles.outgoing
                  : styles.incoming
                  }`}
              >
                <div className={styles.messageContent}>
                  {message.messageText}
                </div>
                <div className={styles.messageTime}>
                  {new Date(message.sentAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyChat}>
              {activeChat ? "No messages yet!" : "Select someone to start chatting"}
            </div>
          )}
        </div>

        <div className={styles["message-input-container"]}>
          <input
            placeholder="Type a message"
            className={styles["message-input"]}
            aria-label="Type a message"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && messageInput.trim() && handleSendMessage()}
            disabled={!activeChat || loading}
          />
          <button
            className={styles["send-button"]}
            aria-label="Send message"
            disabled={!activeChat || !messageInput.trim() || loading}
            onClick={handleSendMessage}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </>
    </main>
  );
}