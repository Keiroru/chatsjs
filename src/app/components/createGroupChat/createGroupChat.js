import styles from "@/app/styles/groupChat.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, act } from "react";
import { useSocket } from "@/lib/socket";

export default function CreateGroupChat({ userData }) {
  const [newTabOpen, setNewTabOpen] = useState(false);

  // const res = await fetch(`${baseUrl}/api/messages/conversationCreate`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           userId1: senderUserId,
  //           userId2: recieverUserId,
  //           groupChatName,
  //           isGroupChat,
  //         }),
  //       });

  //       if (!res.ok) {
  //         throw new Error("Failed to create conversation");
  //       }

  //       response = await res.json();

  //     const finalConversationId = conversationId ?? response.conversationId;

  const handleNewTab = (prev) => {
    setActiveTab((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      {!newTabOpen ? (
        <button onClick={handleNewTab} className={styles.button}>Create a new group</button>
      ) : (
        <button onClick={handleNewTab} className={styles.button}>Close</button>
      )}
    </div>
  );
}
