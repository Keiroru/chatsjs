import styles from "@/app/styles/groupChat.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, act } from "react";
import { useSocket } from "@/lib/socket";

export default function CreateGroupChat({ userData, groupChatName }) {
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
    setNewTabOpen((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      {!newTabOpen ? (
        <button onClick={handleNewTab} className={styles.button}>
          Create a new group
        </button>
      ) : (
        <>
          <button onClick={handleNewTab} className={styles.button}>
            Close
          </button>
          <div>
          <div className={styles.searchFields}>
              <input
                type="text"
                maxLength="20"
                placeholder="Group chat name"
                aria-label="groupChat"
                onChange={(e) => setUsername(e.target.value)}
                className={styles.inputName}
              />
            </div>
            <button
              className={styles.button}
              disabled={
                !groupChatName.trim()
              }
            >
              Continue
            </button>
          </div>
        </>
      )}
    </div>
  );
}
