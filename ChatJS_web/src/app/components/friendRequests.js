import { useEffect, useState } from "react";
import styles from "@/app/styles/friendRequests.module.css";
import Image from "next/image";
import { useSocket } from "@/lib/socket";
import { useTranslation } from "@/contexts/TranslationContext";

export default function FriendRequests({
  userData,
  acceptRequestTabOpen,
  setAcceptRequestTabOpen,
  setFriendRequests,
  friendRequests,
  fetchFriendRequests,
  setFriends,
  activeTab,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const Socket = useSocket();
  const { t } = useTranslation();

  useEffect(() => {
    if (userData?.userId) {
      fetchFriendRequests();
    }
  }, [userData]);

  useEffect(() => {
    if (!Socket) return;

    const handleFriendRequest = (data) => {
      fetchFriendRequests();
    };

    Socket.on("receive_request", handleFriendRequest);

    return () => {
      Socket.off("receive_request", handleFriendRequest);
    };
  }, [Socket, userData]);

  const createConversation = async (sender, receiver) => {
    const response = await fetch("/api/messages/conversationCreate", {
      method: "POST",
      body: JSON.stringify({ userId1: sender, userId2: receiver }),
    });
    const data = await response.json();
    return data.conversationId;
  };

  const handleAccept = async (requestId) => {
    try {
      const response = await fetch("/api/friends/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId }),
      });
      const responseData = await response.json();

      const conversationId = await createConversation(responseData.sender.userId, responseData.receiver.userId);
      Socket.emit("join_conversation", { conversationId: conversationId });

      fetchFriendRequests();

      if (activeTab === "friends") {
        setFriends((prev) => [...prev, responseData.sender]);
      }

      Socket.emit("accept_request", {
        sender: responseData.sender,
        receiver: responseData.receiver,
        conversationId: conversationId
      });
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await fetch("/api/friends/reject", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId }),
      });

      fetchFriendRequests();
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "BUG sdflmbgdifl ughuidffgh diugbdfuiog h";
    }
  };

  return (
    <div className={friendRequests.length > 0 ? styles.container : ""}>
      {friendRequests.length > 0 && !acceptRequestTabOpen && (
        <button onClick={setAcceptRequestTabOpen} className={styles.button}>
          {t("friendRequest")}
        </button>
      )}

      {acceptRequestTabOpen && (
        <div>
          <button
            onClick={setAcceptRequestTabOpen}
            className={styles.closeButton}
          >
            Close
          </button>
          <div className={styles.cardsHolder}>
            {friendRequests.map((request) => (
              <div
                key={request.requestId}
                className={
                  friendRequests.length > 2 ? styles.cardLessWidth : styles.card
                }
              >
                <div className={styles.userInfo}>
                  <Image
                    src={
                      request.profilePicPath ||
                      "/images/user-icon-placeholder.png"
                    }
                    alt="Profile"
                    width={40}
                    height={40}
                    className={styles.avatar}
                  />
                  <div>
                    <h3 className={styles.name}>{request.displayName}</h3>
                    <p className={styles.id}>#{request.displayId}</p>
                    <div className={styles.timestamp}>
                      {formatDate(request.sentAt)}
                    </div>
                  </div>
                </div>

                <div className={styles.actions}>
                  <button
                    className={styles.acceptButton}
                    onClick={() => {
                      handleAccept(request.requestId);
                      if (friendRequests.length === 1) {
                        setAcceptRequestTabOpen();
                      }
                    }}
                  >
                    Accept
                  </button>
                  <button
                    className={styles.rejectButton}
                    onClick={() => {
                      handleReject(request.requestId);
                      if (friendRequests.length === 1) {
                        setAcceptRequestTabOpen();
                      }
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
