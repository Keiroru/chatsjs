import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import styles from "@/app/styles/messages.module.css";
import Settings from "@/app/components/settings/settings";
import Input from "@/app/components/messages/input/input";
import {
  faArrowLeft,
  faArrowDown,
  faReply,
  faCopy,
  faTrash,
  faEdit,
  faSquareCheck,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSocket } from "@/lib/socket";

export default function Messages({
  userData,
  isMobile,
  activeChat,
  isGroupChat,
  onBackToContacts,
  onToggleRightPanel,
  settingsOpen,
  messages,
  setMessages,
  toggleSettings,
  setEditMessage,
  editMessage,
  setBlock,
  block,
}) {
  const [conversationId, setConversationId] = useState(null);
  const messageEnd = useRef(null);
  const socket = useSocket();
  const inputRef = useRef(null);
  const [replyTo, setreplyTo] = useState(null);
  const messagesContainerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    message: null,
  });

  //gorgetes cuccok
  useEffect(() => {
    if (messageEnd.current && messages.length > 0) {
      messageEnd.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages.length]);

  useEffect(() => {
    const container = messagesContainerRef.current;

    const handleScroll = () => {
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;

      setShowScrollButton(distanceFromBottom > 3000);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    if (messageEnd.current) {
      messageEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  };

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

        if (newMessage.senderUserId !== userData.userId) {
          markMessageAsSeen(newMessage.messageId);
        }
      }
    };

    const handleBlockFriend = (data) => {
      setBlock(data);
    };

    const handleUnblockFriend = (data) => {
      setBlock(null);
    };

    const handleEditMessage = (data) => {
      setMessages((prevMessages) =>
        prevMessages.map((message) => {
          if (message.messageId === data.messageId) {
            return { ...message, messageText: data.newMessage, isEdited: 1 };
          }
          return message;
        })
      );
    };

    const handleMessageStateUpdate = (data) => {
      setMessages((prevMessages) =>
        prevMessages.map((message) => {
          if (message.messageId === data.messageId) {
            return { ...message, state: data.state };
          }
          return message;
        })
      );
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("block", handleBlockFriend);
    socket.on("unblock", handleUnblockFriend);
    socket.on("receive_edit", handleEditMessage);
    socket.on("message_state_update", handleMessageStateUpdate);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("block", handleBlockFriend);
      socket.off("unblock", handleUnblockFriend);
      socket.off("receive_edit", handleEditMessage);
      socket.off("message_state_update", handleMessageStateUpdate);
    };
  }, [socket, conversationId, setMessages, setBlock, userData.userId]);

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

  // Conversation ID is fetched here
  const fetchConversationId = useCallback(async () => {
    try {
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
      setBlock(data);

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

        if (response.ok) {
          setConversationId(data.conversationId);
        }
      }
    } catch (error) {
      console.error("Error fetching conversationId:", error);
    }
  }, [activeChat, userData]);

  // Messages are fetched here
  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    console.log(block);
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
    if (activeChat) {
      fetchConversationId();
    }
  }, [activeChat, fetchConversationId]);

  useEffect(() => {
    setEditMessage(null);
  }, [activeChat, setEditMessage]);

  const deleteMessage = async (messageId, senderId) => {
    if (senderId !== userData.userId) {
      console.warn("You can only delete your own messages.");
      return;
    }

    try {
      socket.emit("delete_message", {
        messageId,
        senderId,
        conversationId,
        receiver: activeChat.userId,
      });

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

  useEffect(() => {
    if (!contextMenu.visible) return;

    function handleClickOutside(event) {
      const menuElement = document.querySelector(`.${styles.menu}`);
      if (menuElement && !menuElement.contains(event.target)) {
        setContextMenu({ ...contextMenu, visible: false });
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenu.visible]);

  const markMessageAsSeen = async (messageId) => {
    try {
      setMessages((prevMessages) =>
        prevMessages.map((message) => {
          if (message.messageId === messageId) {
            return { ...message, state: "seen" };
          }
          return message;
        })
      );

      const response = await fetch("/api/messages/messageSeen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          messageId,
        }),
      });

      if (response.ok) {
        socket.emit("message_seen", {
          messageId,
          conversationId,
          senderId: activeChat.userId,
        });

        socket.emit("message_state_update", {
          messageId,
          conversationId,
          state: "seen",
          senderId: activeChat.userId,
        });
      }
    } catch (error) {
      console.error("Error marking message as seen:", error);
    }
  };

  useEffect(() => {
    if (messages.length > 0 && conversationId) {
      const unreadMessages = messages.filter(
        (message) =>
          message.senderUserId !== userData.userId && message.state !== "seen"
      );

      unreadMessages.forEach((message) => {
        markMessageAsSeen(message.messageId);
      });
    }
  }, [messages, conversationId, userData.userId]);

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
              onClick={activeChat ? onToggleRightPanel : null}
              aria-label="Toggle contact info"
            >
              <Image
                src={
                  activeChat?.profilePicPath ||
                  "/images/user-icon-placeholder.png"
                }
                alt="Contact avatar"
                width={60}
                height={60}
                className={styles.profil}
              />
              <h1>
                {activeChat?.displayName ||
                  activeChat?.conversationName ||
                  "Select a contact"}
              </h1>
            </button>
          </header>

          <div
            ref={messagesContainerRef}
            onContextMenu={(e) => {
              e.preventDefault();
            }}
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
                    className={`${styles.message} ${message.senderUserId === userData.userId
                        ? styles.outgoing
                        : styles.incoming
                      }`}
                  >
                    {message.senderUserId != userData.userId && (
                      <Image
                        src={
                          message.senderUserId === userData.userId
                            ? userData.profilePicPath ||
                            "/images/user-icon-placeholder.png"
                            : activeChat?.profilePicPath ||
                            "/images/user-icon-placeholder.png"
                        }
                        width={40}
                        height={40}
                        alt="Sender avatar"
                        className={styles.avatar}
                      />
                    )}

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
                          <span
                            className={`${originalMessage.isDeleted === 1
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

                          //thank god there are smart people on the internet
                          const viewportWidth = window.innerWidth;
                          const viewportHeight = window.innerHeight;

                          const menuWidth = 220;
                          const menuHeight = 220;

                          let x = e.clientX;
                          let y = e.clientY;

                          if (x + menuWidth > viewportWidth) {
                            x = viewportWidth - menuWidth - 10;
                          }

                          if (y + menuHeight > viewportHeight) {
                            y = viewportHeight - menuHeight - 20;
                          }

                          setContextMenu({
                            visible: true,
                            x: x,
                            y: y,
                            message: message.isDeleted === 1 ? null : message,
                            senderId: message.senderUserId,
                            messageId: message.messageId,
                          });
                        }}
                        onClick={() => {
                          setContextMenu({ ...contextMenu, visible: false });
                        }}
                        className={`${styles.messageContent} ${message.isDeleted === 1
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
                        {message.state === "sent" ? (
                          <FontAwesomeIcon
                            icon={faCheck}
                            className={styles.icon}
                          />
                        ) : message.state === "seen" ? (
                          <FontAwesomeIcon
                            icon={faSquareCheck}
                            className={styles.icon}
                          />
                        ) : null}
                        {message.isEdited === 1 && "|Edited| "}
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

            {showScrollButton && (
              <div className={styles.scrollWrapper}>
                <button
                  className={styles.scrollToBottomButton}
                  onClick={scrollToBottom}
                  aria-label="Scroll to bottom"
                >
                  <FontAwesomeIcon icon={faArrowDown} />
                </button>
              </div>
            )}

            <div ref={messageEnd}></div>
          </div>
          {activeChat &&
            (block?.blocker === userData?.userId ? (
              <div className={styles.blocked}>You blocked this user</div>
            ) : block?.blocked === userData?.userId ? (
              <div className={styles.blocked}>You are blocked by this user</div>
            ) : userData.isLookingForFriends === 1 ? (
              <Input
                activeChat={activeChat}
                userData={userData}
                conversationId={conversationId}
                ref={inputRef}
                replyTo={replyTo}
                setreplyTo={setreplyTo}
                editMessage={editMessage}
                setEditMessage={setEditMessage}
              />
            ) : (
              <Input
                activeChat={activeChat}
                userData={userData}
                conversationId={conversationId}
                ref={inputRef}
                replyTo={replyTo}
                setreplyTo={setreplyTo}
                editMessage={editMessage}
                setEditMessage={setEditMessage}
              />
            ))}

          {contextMenu.visible && (
            <div
              className={styles.menu}
              style={{
                position: "fixed",
                top: `${contextMenu.y}px`,
                left: `${contextMenu.x}px`,
              }}
            >
              <div className={styles.menuHeader}>Message Actions</div>

              <button
                className={styles.menuItem}
                onClick={() => {
                  setreplyTo(contextMenu.message);
                  setContextMenu({ ...contextMenu, visible: false });
                  inputRef.current.focus();
                }}
              >
                <span className={styles.menuItemIcon}>
                  <FontAwesomeIcon icon={faReply} />
                </span>
                Reply To:{" "}
                {contextMenu.message?.messageText.length > 20
                  ? contextMenu.message?.messageText.substring(0, 17) + "..."
                  : contextMenu.message?.messageText}
              </button>

              <button
                className={styles.menuItem}
                onClick={() => {
                  navigator.clipboard.writeText(
                    contextMenu.message?.messageText || ""
                  );
                  setContextMenu({ ...contextMenu, visible: false });
                }}
              >
                <span className={styles.menuItemIcon}>
                  <FontAwesomeIcon icon={faCopy} />
                </span>
                Copy Text
              </button>

              <button
                className={styles.menuItem}
                onClick={() => {
                  if (contextMenu.senderId !== userData.userId) {
                    alert("You can only edit your own messages");
                    setContextMenu({ ...contextMenu, visible: false });
                    return;
                  }
                  setEditMessage(contextMenu.message);
                  inputRef.current.focus();
                  setContextMenu({ ...contextMenu, visible: false });
                }}
              >
                <span className={styles.menuItemIcon}>
                  <FontAwesomeIcon icon={faEdit} />
                </span>
                Edit Message
              </button>

              <div className={styles.menuDivider}></div>

              <button
                className={`${styles.menuItem} ${styles.menuItemDelete}`}
                onClick={() => {
                  deleteMessage(
                    contextMenu.message?.messageId,
                    contextMenu.senderId
                  );
                  setContextMenu({ ...contextMenu, visible: false });
                }}
              >
                <span className={styles.menuItemIcon}>
                  <FontAwesomeIcon icon={faTrash} />
                </span>
                Delete
              </button>
            </div>
          )}
        </main>
      )}
    </>
  );
}
