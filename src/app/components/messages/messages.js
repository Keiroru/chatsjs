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
  const inputRef = useRef(null);
  const [replyTo, setreplyTo] = useState(null);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    message: null,
  });

  //Socket stuff
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (newMessage) => {
      if (newMessage.conversationId === conversationId) {
        const formattedMessage = {
          ...newMessage,
          sentAt: formatMessageTime(newMessage.sentAt),
        };
        setMessages((prevMessages) => [...prevMessages, formattedMessage]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, conversationId, setMessages]);

  useEffect(() => {
    if (!socket) return;

    const handleDeleteMessage = (data) => {
      setMessages((prevMessages) =>
        prevMessages.map((message) => {
          if (message.messageId === data.messageId) {
            return {
              ...message,
              isDeleted: 1,
            };
          }
          return message;
        })
      );
    };

    socket.on("delete", handleDeleteMessage);

    return () => {
      socket.off("delete", handleDeleteMessage);
    };
  }, [socket]);

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
      ]);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [conversationId, setMessages]);

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
        month: "short",
        day: "numeric",
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

  const deleteMessage = async (messageId, senderId) => {
    if (senderId !== userData.userId) {
      console.warn("You can only delete your own messages.");
      return;
    }

    try {
      socket.emit("delete_message", { messageId, senderId });

      const response = await fetch(`/api/messages/deleteMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messageId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete message: ${response.statusText}`);
      }

      setMessages((prevMessages) =>
        prevMessages.map((message) => {
          if (message.messageId === messageId) {
            return {
              ...message,
              isDeleted: 1,
            };
          }
          return message;
        })
      );

      console.log(`Message ${messageId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <>
      {settingsOpen ? (
        <Settings
          userData={userData}
          isMobile={isMobile}
          toggleSettings={toggleSettings}
          conversationId={conversationId}
          ref={inputRef}
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
                className={styles.profil}
              />
              <h1>{activeChat?.displayName || "Select a contact"}</h1>
            </button>
          </header>

          <div
            onContextMenu={(e) => {
              e.preventDefault();
            }}
            onClick={() => setContextMenu({ ...contextMenu, visible: false })}
            className={styles["messages-container"]}
          >
            {!activeChat ? (
              <div className={styles.emptyChat}>
                Select someone to start chatting
              </div>
            ) : conversationId === null ? (
              <div className={styles.emptyChat}>
                You are not friends with this user
              </div>
            ) : messages.length > 0 ? (
              messages.map((message) => {
                const originalMessage = message.replyTo
                  ? messages.find((m) => m.messageId === message.replyTo)
                  : null;

                return (
                  <div
                    id={`message-${message.messageId}`}
                    key={message.messageId}
                    className={`${styles.message} ${
                      message.senderUserId === userData.userId
                        ? styles.outgoing
                        : styles.incoming
                    }`}
                  >
                    <Image
                      src={
                        message.senderUserId === userData.userId
                          ? userData.profilePicPath ||
                            "https://placehold.co/50x50"
                          : activeChat?.profilePicPath ||
                            "https://placehold.co/50x50"
                      }
                      width={40}
                      height={40}
                      alt="Sender avatar"
                      className={styles.avatar}
                    />

                    <div className={styles.messageWrapper}>
                      {originalMessage && (
                        <div
                          className={styles.replyReference}
                          onClick={() => {
                            const scroll = document.getElementById(
                              `message-${originalMessage.messageId}`
                            );
                            if (scroll) {
                              scroll.scrollIntoView({ behavior: "smooth" });
                            }
                          }}
                        >
                          <span className={styles.replyIcon}>↩️</span>
                          <span
                            className={`${
                              originalMessage.isDeleted === 1
                                ? styles["deleted-message"]
                                : ""
                            }`}
                          >
                            {originalMessage.isDeleted === 0
                              ? originalMessage.messageText.length > 40
                                ? originalMessage.messageText.substring(0, 37) +
                                  "..."
                                : originalMessage.messageText
                              : "Deleted Message"}
                          </span>
                        </div>
                      )}

                      <div
                        onContextMenu={(e) => {
                          e.preventDefault();
                          console.log("right click", message);
                          setContextMenu({
                            visible: true,
                            x: e.clientX,
                            y: e.clientY,
                            message: message.isDeleted === 1 ? null : message,
                            senderId: message.senderUserId,
                            messageId: message.messageId,
                          });
                        }}
                        onClick={() => {
                          setContextMenu({ ...contextMenu, visible: false });
                        }}
                        className={`${styles.messageContent} ${
                          message.isDeleted === 1
                            ? styles["deleted-message"]
                            : ""
                        }`}
                      >
                        {message.isDeleted === 1
                          ? "Deleted Message"
                          : message.messageText}
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
                  </div>
                );
              })
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
            ref={inputRef}
            replyTo={replyTo}
            setreplyTo={setreplyTo}
          />

          {contextMenu.visible && (
            <div
              className={styles.menu}
              style={{
                position: "fixed",
                top: `${contextMenu.y}px`,
                left: `${contextMenu.x}px`,
              }}
            >
              <div
                onClick={() => {
                  setreplyTo(contextMenu.message);
                  setContextMenu({ ...contextMenu, visible: false });
                  inputRef.current.focus();
                }}
                className={styles.menuItem}
              >
                Reply to: {contextMenu.message?.messageText.substring(0, 20)}...
              </div>
              <div
                className={styles.menuItem}
                onClick={() => {
                  navigator.clipboard.writeText(
                    contextMenu.message?.messageText || ""
                  );
                  setContextMenu({ ...contextMenu, visible: false });
                }}
              >
                Copy
              </div>
              <div
                className={styles.menuItem}
                onClick={() => {
                  deleteMessage(
                    contextMenu.message?.messageId,
                    contextMenu.senderId
                  );
                  setContextMenu({ ...contextMenu, visible: false });
                }}
              >
                Delete
              </div>
            </div>
          )}
        </main>
      )}
    </>
  );
}
