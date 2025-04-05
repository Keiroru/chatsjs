import styles from "@/app/styles/input.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import React, { forwardRef, useState, useEffect } from "react";
import { useSocket } from "@/lib/socket";

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
    },
    ref
  ) => {
    const [messageInput, setMessageInput] = useState("");
    const [loading, setLoading] = useState(false);
    const socket = useSocket();

    useEffect(() => {
      if (replyTo && ref?.current) {
        ref.current.focus();
      }
    }, [replyTo, ref]);

    const handleSendMessage = async () => {
      if (!messageInput.trim() || !conversationId) return;
      setLoading(true);

      console.log("editMessage", editMessage);
      if (editMessage && editMessage.senderUserId === userData.userId) {
        console.log("Editing message:", editMessage.messageId);
        console.log("New message text:", messageInput.trim());
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
            socket.emit("edit_message", {
              messageId: editMessage.messageId,
              newMessage: messageInput,
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
      } else if (editMessage && editMessage.senderUserId !== userData.userId) {
        console.log("you can only edit your own messages");
        setMessageInput("");
        setEditMessage(null);
        setLoading(false);
        return;
      }

      if (messageInput.length > 20000) {
        alert(
          "Message too long. Please shorten it. Max 20,000 characters. Current char count: " +
          messageInput.length
        );
        setLoading(false);
        return;
      }

      try {
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
        };
        if (response.ok) {
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
                Replying to: {replyTo.messageText.substring(0, 50)}
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
                Editing Message: {editMessage.messageText.substring(0, 50)}
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
              placeholder="Type a message"
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
