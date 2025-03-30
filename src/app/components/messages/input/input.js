import styles from "@/app/styles/input.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, act } from "react";
import { useSocket } from "@/lib/socket";

export default function Input({
  activeChat,
  userData,
  conversationId,
}) {
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const socket = useSocket();

  const handleSendMessage = async () => {
    setLoading(true);

    try {
      const messageData = {
        conversationId: conversationId,
        senderUserId: userData.userId,
        messageText: messageInput.trim(),
        senderName: userData.displayName,
        senderProfilePic: userData.profilePicPath,
        sentAt: new Date().toISOString(),
      };

      socket.emit("send_message", messageData);

      const response = await fetch("/api/messages/postMessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: conversationId,
          senderUserId: userData.userId,
          messageText: messageInput.trim(),
        }),
      });

      if (!response.ok) {
        console.error("Failed to send message via API:", response.statusText);
        return;
      }

      setMessageInput("");

      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["message-input-container"]}>
      <input
        ref={inputRef}
        placeholder="Type a message"
        className={styles["message-input"]}
        aria-label="Type a message"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" && messageInput.trim() && handleSendMessage()
        }
        disabled={!activeChat || loading}
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
  );
}
