import styles from "@/app/styles/input.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import React, { forwardRef, useState, useEffect } from "react";
import { useSocket } from "@/lib/socket";
import { useTranslation } from "@/contexts/TranslationContext";

const Input = forwardRef(
  (
    {
      activeChat,
      userData,
      conversationId,
      replyTo,
      setreplyTo,
      editMessage,
      setEditMessage,
      setMessages,
      formatMessageTime,
      setFriends,
    },
    ref
  ) => {
    const [messageInput, setMessageInput] = useState("");
    const [loading, setLoading] = useState(false);
    const socket = useSocket();
    const { t } = useTranslation();

    useEffect(() => {
      if (replyTo && ref?.current) {
        ref.current.focus();
      }
    }, [replyTo, ref]);

    const handleSendMessage = async () => {
      if (!messageInput.trim() || !conversationId) return;
      setLoading(true);

      if (messageInput.length > 20000) {
        alert(
          t("messageTooLong") + messageInput.length
        );
        setLoading(false);
        return;
      }


      if (editMessage) {
        try {
          const response = await fetch("/api/messages/editMessage", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messageId: editMessage.messageId,
              newMessage: messageInput,
            }),
          });

          if (response.ok) {
            setMessageInput("");
            setEditMessage(null);
            setMessages((prevMessages) => prevMessages.map(msg =>
              msg.messageId === editMessage.messageId
                ? { ...msg, messageText: messageInput, isEdited: 1 }
                : msg
            ));
            socket.emit("edit_message", {
              messageId: editMessage.messageId,
              newMessage: messageInput,
              conversationId: conversationId,
            });
            setTimeout(() => {
              if (ref.current) {
                ref.current.focus();
              }
            }, 1);
            setLoading(false);
          }
          return;
        } catch (error) {
          console.error("Error editing message:", error);
          setLoading(false);
        }
      }

      try {
        setFriends((prevFriends) => prevFriends.map(friend =>
          friend.userId === activeChat.userId
            ? { ...friend, lastMessage: messageInput.trim() }
            : friend
        ));
        const response = await fetch("/api/messages/postMessages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversationId: conversationId,
            senderUserId: userData.userId,
            messageText: messageInput.trim(),
            replyTo: replyTo ? replyTo.messageId : null,
          }),
        });

        var res = await response.json();

        const messageData = {
          conversationId: conversationId,
          messageId: res.data.messageId,
          senderUserId: userData.userId,
          messageText: messageInput.trim(),
          senderName: userData.displayName,
          senderProfilePic: userData.profilePicPath,
          sentAt: new Date().toISOString(),
          replyTo: replyTo ? replyTo.messageId : null,
          isDeleted: res.data.isDeleted,
          isEdited: res.data.isEdited,
          receiver: res.receiver,
          state: "sent",
        };

        if (response.ok) {
          setMessages((prevMessages) => [...prevMessages, {
            ...messageData,
            sentAt: formatMessageTime(messageData.sentAt)
          }]);

          setMessageInput("");
          setreplyTo(null);
          socket.emit("send_message", messageData);

          setTimeout(() => {
            if (ref.current) {
              ref.current.focus();
            }
          }, 1);
        } else {
          console.error("Failed to send message via API");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setLoading(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey && messageInput.trim()) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    return (
      <>
        {replyTo && (
          <div className={styles.replyPreview}>
            <div className={styles.replyContent}>
              <p className={styles.replyTo}>
                {t("replyPreview")} {replyTo.messageText.substring(0, 50)}
                {replyTo.messageText.length > 50 ? "..." : ""}
              </p>
              <button
                className={styles.cancelReply}
                onClick={() => setreplyTo(null)}
              >
                ×
              </button>
            </div>
          </div>
        )}

        {editMessage && (
          <div className={styles.replyPreview}>
            <div className={styles.replyContent}>
              <p className={styles.replyTo}>
                {t("editingMessage")} {editMessage.messageText.substring(0, 50)}
                {editMessage.messageText.length > 50 ? "..." : ""}
              </p>
              <button
                className={styles.cancelReply}
                onClick={() => setEditMessage(null)}
              >
                ×
              </button>
            </div>
          </div>
        )}
        <div className={styles["message-input-container"]}>
          <div className={styles["input-row"]}>
            <input
              type="text"
              ref={ref}
              placeholder={t("typeMessage")}
              className={styles["message-input"]}
              aria-label="Type a message"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!activeChat || loading}
              autoComplete="off"
              id="message-input"
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
        </div>
      </>
    );
  }
);

Input.displayName = "Input";

export default Input;
