import styles from "@/app/styles/input.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef } from "react";

export default function Input({
  activeChat,
  userData,
  conversationId,
  setMessages,
}) {
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
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
        setMessages((prevMessages) => [...prevMessages, data.data]);
        setMessageInput("");
      } else {
        console.error("Failed to send message:", data.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
      document.getElementById("message-input").focus();
    }
  };

  return (
    <div className={styles["message-input-container"]}>
      <input
        placeholder="Type a message"
        className={styles["message-input"]}
        aria-label="Type a message"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" &&
          messageInput.trim() &&
          handleSendMessage() &&
          e.target.focus()
        }
        disabled={!activeChat || loading}
        autoFocus
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
