import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import styles from "@/app/styles/messages.module.css";
import Settings from "@/app/components/settings/settings";
import Input from "@/app/components/messages/input";
import { useTranslation } from "@/contexts/TranslationContext";
import {
  faArrowLeft,
  faArrowDown,
  faReply,
  faCopy,
  faTrash,
  faEdit,
  faSquareCheck,
  faCheck,
  faExclamationCircle,
  faXmark,
  faDownload,
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
  conversationId,
  setFriends,
  rightPanelOpen,
  canChat,
  setAttachments,
}) {
  const { t } = useTranslation();
  const messageEnd = useRef(null);
  const socket = useSocket();
  const inputRef = useRef(null);
  const [replyTo, setreplyTo] = useState(null);
  const messagesContainerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [imageOpen, setImageOpen] = useState(false);
  const [imageView, setImageView] = useState(null);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    message: null,
  });

  const downloadImage = async (image) => {
    try {
      const response = await fetch(image.filePath);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = image.fileName || "image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    } else {
      return (bytes / 1024).toFixed(1) + " KB";
    }
  };

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
      console.log("newMessage", newMessage);
      if (newMessage.conversationId === conversationId) {
        console.log(newMessage);
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
    setEditMessage(null);
  }, [activeChat, setEditMessage]);

  const deleteMessage = async (messageId, senderId) => {
    setFriends((prevFriends) =>
      prevFriends.map((friend) =>
        friend.userId === activeChat.userId
          ? { ...friend, lastMessage: t("deletedMessage") }
          : friend
      )
    );

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

  const handleReportMessage = async (message) => {
    const response = await fetch("/api/messages/reportMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messageId: message.messageId }),
    });
    if (response.ok) {
      alert(t("messageReportAlert"));
    } else {
      alert(t("messageReportAlertError"));
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
        <main
          className={`${styles["chat-main"]} ${
            rightPanelOpen ? styles["right-open"] : ""
          }`}
        >
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
                  (isGroupChat === false
                    ? "/images/user-icon-placeholder.png"
                    : "/images/groupChat-icon-placeholder.png")
                }
                alt="Contact avatar"
                width={60}
                height={60}
                className={styles.profil}
              />
              <h1>
                {activeChat?.displayName ||
                  activeChat?.conversationName ||
                  t("selectacontact")}
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
              <div className={styles.emptyChat}>{t("selectsomeone")}</div>
            ) : canChat === false && userData.isLookingForFriends === 0 ? (
              <div className={styles.emptyChat}>
                You are not not looking for friends, cant send new messages
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
                    {message.senderUserId != userData.userId && (
                      <Image
                        src={
                          isGroupChat
                            ? message.senderProfilePic ||
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
                      {isGroupChat &&
                        message.senderUserId !== userData.userId && (
                          <div className={styles.senderName}>
                            {message.senderName}
                          </div>
                        )}
                      <div className={styles.messageContentWrapper}>
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
                              className={`${
                                originalMessage.isDeleted === 1
                                  ? styles["deleted-message"]
                                  : ""
                              }`}
                            >
                              {originalMessage.isDeleted === 0
                                ? originalMessage.messageText &&
                                  originalMessage.messageText.length > 0
                                  ? originalMessage.messageText.length > 40
                                    ? originalMessage.messageText.substring(
                                        0,
                                        37
                                      ) + "..."
                                    : originalMessage.messageText
                                  : originalMessage.fileName &&
                                    originalMessage.fileName.length > 0
                                  ? originalMessage.fileName.length > 40
                                    ? originalMessage.fileName.substring(
                                        0,
                                        37
                                      ) + "..."
                                    : originalMessage.fileName
                                  : t("deletedMessage")
                                : t("deletedMessage")}
                            </span>
                          </div>
                        )}

                        <div
                          onContextMenu={(e) => {
                            e.preventDefault();

                            const viewportWidth = window.innerWidth;
                            const viewportHeight = window.innerHeight;

                            const menuWidth = 220;
                            const menuHeight = 220;

                            let x = e.clientX;
                            let y = e.clientY;

                            if (x + menuWidth > viewportWidth - 10) {
                              x = x - menuWidth;
                            }

                            if (y + menuHeight > viewportHeight - 50) {
                              y = y - menuHeight - 5;
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
                          className={`${styles.messageContent} ${
                            message.isDeleted === 1
                              ? styles["deleted-message"]
                              : ""
                          }`}
                        >
                          {message.isDeleted === 1
                            ? t("deletedMessage")
                            : message.messageText}
                          {message.filePath && message.isDeleted != 1 && (
                            <Image
                              src={message.filePath}
                              alt={message.fileName}
                              width={150}
                              height={150}
                              className={styles.messageImage}
                              onClick={() => {
                                setImageOpen(true);
                                setImageView(message);
                              }}
                            />
                          )}
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
                          {message.isEdited === 1 && t("editedMessage")}{" "}
                          {message.sentAt}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={styles.emptyChat}>{t("noMessagesYet")}</div>
            )}

            {imageOpen && (
              <div
                className={styles.imageViewerOverlay}
                onClick={() => setImageOpen(false)}
              >
                <div
                  className={styles.imageViewerContent}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={styles.imageViewerHeader}>
                    <button
                      className={styles.downloadButton}
                      onClick={async () => {
                        downloadImage(imageView);
                      }}
                    >
                      <FontAwesomeIcon icon={faDownload} />
                    </button>
                    <button
                      className={styles.closeButton}
                      onClick={() => setImageOpen(false)}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>

                  <Image
                    src={imageView.filePath}
                    alt={imageView.fileName}
                    width={500}
                    height={500}
                    className={styles.imageViewerImage}
                  />

                  <div className={styles.imageViewerDetails}>
                    <p className={styles.imageName}>{imageView.fileName}</p>
                    <p className={styles.imageSize}>
                      {formatFileSize(imageView.fileSize)}
                    </p>
                  </div>
                </div>
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
              <div className={styles.blocked}>{t("blocked")}</div>
            ) : block?.blocked === userData?.userId ? (
              <div className={styles.blocked}>{t("blockedBy")}</div>
            ) : activeChat.isDeleted === 1 ? (
              <div className={styles.blocked}>{t("userDeleted")}</div>
            ) : userData.isLookingForFriends === 0 ? (
              canChat === true && (
                <Input
                  activeChat={activeChat}
                  userData={userData}
                  conversationId={conversationId}
                  ref={inputRef}
                  replyTo={replyTo}
                  setreplyTo={setreplyTo}
                  editMessage={editMessage}
                  setEditMessage={setEditMessage}
                  setMessages={setMessages}
                  formatMessageTime={formatMessageTime}
                  setFriends={setFriends}
                  attachment={attachment}
                  setAttachment={setAttachment}
                  setAttachments={setAttachments}
                />
              )
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
                setMessages={setMessages}
                formatMessageTime={formatMessageTime}
                setFriends={setFriends}
                attachment={attachment}
                setAttachment={setAttachment}
                setAttachments={setAttachments}
                isGroupChat={isGroupChat}
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
              <div className={styles.menuHeader}>{t("actions")}</div>

              <button
                className={styles.menuItem}
                onClick={() => {
                  setreplyTo(contextMenu.message);
                  setContextMenu({ ...contextMenu, visible: false });
                  inputRef.current.focus();
                  setEditMessage(null);
                  setAttachment(null);
                }}
              >
                <span className={styles.menuItemIcon}>
                  <FontAwesomeIcon icon={faReply} />
                </span>
                {t("replyTo")}:{" "}
                {contextMenu.message?.messageText &&
                contextMenu.message?.messageText.length > 0
                  ? contextMenu.message.messageText.length > 20
                    ? contextMenu.message.messageText.substring(0, 17) + "..."
                    : contextMenu.message.messageText
                  : contextMenu.message?.fileName.length > 20
                  ? contextMenu.message.fileName.substring(0, 17) + "..."
                  : contextMenu.message?.fileName}
              </button>

              {contextMenu.message?.messageText.length > 0 && (
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
                  {t("copyText")}
                </button>
              )}

              {contextMenu.senderId === userData.userId && (
                <button
                  className={styles.menuItem}
                  onClick={() => {
                    setEditMessage(contextMenu.message);
                    inputRef.current.focus();
                    setContextMenu({ ...contextMenu, visible: false });
                    setreplyTo(null);
                    setAttachment(null);
                  }}
                >
                  <span className={styles.menuItemIcon}>
                    <FontAwesomeIcon icon={faEdit} />
                  </span>
                  {t("edit")}
                </button>
              )}

              <div className={styles.menuDivider}></div>

              {contextMenu.senderId !== userData.userId && (
                <button
                  onClick={() => {
                    handleReportMessage(contextMenu.message);
                    setContextMenu({ ...contextMenu, visible: false });
                  }}
                  className={`${styles.menuItem} ${styles.menuItemDelete}`}
                >
                  <span className={styles.menuItemIcon}>
                    <FontAwesomeIcon icon={faExclamationCircle} />
                  </span>
                  {t("reportMessage")}
                </button>
              )}

              {contextMenu.senderId === userData.userId && (
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
                  {t("delete")}
                </button>
              )}
            </div>
          )}
        </main>
      )}
    </>
  );
}
