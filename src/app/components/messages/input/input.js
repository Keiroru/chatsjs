import styles from "@/app/styles/input.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import React, { forwardRef, useState, useEffect } from "react";
import { useSocket } from "@/lib/socket";

const Input = forwardRef(
  ({ activeChat, userData, conversationId, replyTo, setreplyTo }, ref) => {
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
        res = res.data.messageId;
        const messageData = {
          conversationId: conversationId,
          messageId: res,
          senderUserId: userData.userId,
          messageText: messageInput.trim(),
          senderName: userData.displayName,
          senderProfilePic: userData.profilePicPath,
          sentAt: new Date().toISOString(),
          replyTo: replyTo ? replyTo.messageId : null,
          isDeleted: 0,
        };
        if (response.ok) {
          setMessageInput("");
          setreplyTo(null);
          socket.emit("send_message", messageData);
          if (ref?.current) {
            ref.current.focus();
          }
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
