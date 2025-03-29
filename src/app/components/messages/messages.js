import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import styles from "@/app/styles/messages.module.css";
import Settings from "@/app/components/settings/settings";
import Input from "@/app/components/messages/input/input";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSocket } from "@/lib/socket";

export default function Messages({
  userData,
  isMobile,
  activeChat,
  onBackToContacts,
  onToggleRightPanel,
  settingsOpen,
  messages,
  setMessages,
  toggleSettings,
}) {
  const [conversationId, setConversationId] = useState(null);
  const messageEnd = useRef(null);
  const socket = useSocket();

  //Socket stuff
  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", (newMessage) => {
      if (newMessage.conversationId === conversationId) {
        const formattedMessage = {
          ...newMessage,
          sentAt: formatMessageTime(newMessage.sentAt),
        };
        setMessages((prevMessages) => [...prevMessages, formattedMessage]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket, conversationId, setMessages]);

  useEffect(() => {
    if (messageEnd.current) {
      messageEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Conversation ID is fetched here
  const fetchConversationId = useCallback(async () => {
    try {
      const response = await fetch("/api/messages/conversationID", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId1: userData.userId,
          userId2: activeChat.friendId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.conversationId) {
        setConversationId(data.conversationId);
      } else {
        setConversationId(null);
      }
    } catch (error) {
      console.error("Error fetching conversationId:", error);
    }
  }, [activeChat, userData]);

  // Messages are fetched here
  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;

    try {
      const response = await fetch(
        `/api/messages/getMessages?conversationId=${conversationId}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }

      const data = await response.json();
      setMessages((prevMessages) => [
        ...data.map((message) => ({
          ...message,
          sentAt: formatMessageTime(message.sentAt),
        })),
      ])
      console.log("Fetched messages:", data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [conversationId]);

  const formatMessageTime = (timestamp) => {
    const messageDate = new Date(timestamp);
    const now = new Date();

    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      const time = messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      return `Yesterday ${time}`;
    }

    if (messageDate.getFullYear() === now.getFullYear()) {
      return messageDate.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
      });
    }

    return messageDate.getFullYear().toString();
  };

  // Fetch messages when conversationId changes
  useEffect(() => {
    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId, fetchMessages]);

  useEffect(() => {
    if (activeChat && userData) {
      fetchConversationId();
    }
  }, [activeChat, userData, fetchConversationId]);

  return (
    <>
      {settingsOpen ? (
        <Settings
          userData={userData}
          isMobile={isMobile}
          onBackToContacts={onBackToContacts}
          toggleSettings={toggleSettings}
        />
      ) : (
        <main className={styles["chat-main"]}>
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
                src={activeChat?.profilePicPath || "https://placehold.co/50x50"}
                alt="Contact avatar"
                width={60}
                height={60}
                className={styles.avatar}
              />
              <h1>{activeChat?.displayName || "Select a contact"}</h1>
            </button>
          </header>

          <div className={styles["messages-container"]}>
            {conversationId === null ? (
              <div className={styles.emptyChat}>You are not friends with this user</div>
            ) : messages.length > 0 ? (
              messages.map((message) => (
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
                  <div
                    className={
                      message.senderUserId === userData.userId
                        ? styles.messageTime
                        : styles.messageTimeLeft
                    }
                  >
                    {message.sentAt}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyChat}>
                {activeChat
                  ? "No messages yet!"
                  : "Select someone to start chatting"}
              </div>
            )}

            <div ref={messageEnd}></div>
          </div>

          <Input
            activeChat={activeChat}
            userData={userData}
            conversationId={conversationId}
          />
        </main>
      )}
    </>
  );
}
