import { useEffect, useState } from "react";
import styles from "@/app/styles/friendRequests.module.css";
import Image from "next/image";

export default function FriendRequests({
  userData,
  onRequestAccept,
  acceptRequestTabOpen,
  setAcceptRequestTabOpen,
}) {
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    async function fetchFriendRequests() {
      try {
        const response = await fetch(
          `/api/friends/requests?receiverUserId=${userData.userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch friend requests");
        const data = await response.json();
        setFriendRequests(data);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    }

    if (userData.userId) {
      fetchFriendRequests();
      const interval = setInterval(fetchFriendRequests, 5000);
      return () => clearInterval(interval);
    }
  }, [userData.userId]);

  const handleAccept = async (requestId) => {
    try {
      const response = await fetch("/api/friends/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId }),
      });
      const repsonseData = await response.json();
      console.log(repsonseData);

      setFriendRequests(
        friendRequests.filter((request) => request.requestId !== requestId)
      );
      onRequestAccept();
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await fetch("/api/friends/reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId }),
      });
      setFriendRequests(
        friendRequests.filter((request) => request.requestId !== requestId)
      );
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  return (
    <div className={friendRequests.length > 0 ? styles.container : ""}>
      {friendRequests.length > 0 && !acceptRequestTabOpen && (
        <button onClick={setAcceptRequestTabOpen} className={styles.button}>
          New request
        </button>
      )}
      {acceptRequestTabOpen && (
        <div>
          <button onClick={setAcceptRequestTabOpen} className={styles.button}>
            close
          </button>
          <div className={styles.cardsHolder}>
            {friendRequests.map((request) => (
              <div key={request.requestId} className={styles.card}>
                <div className={styles.userInfo}>
                  <Image
                    src={request.profilePicPath || "https://placehold.co/40x40"}
                    alt="Profile"
                    width={40}
                    height={40}
                    className={styles.avatar}
                  />
                  <div>
                    <h3 className={styles.name}>{request.displayName}</h3>
                    <p className={styles.id}>#{request.displayId}</p>
                    <div className={styles.timestamp}>
                      {new Date(request.sentAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className={styles.actions}>
                  <button
                    className={styles.acceptButton}
                    onClick={() => {
                      handleAccept(request.requestId);
                      setAcceptRequestTabOpen();
                    }}
                  >
                    Accept
                  </button>
                  <button
                    className={styles.rejectButton}
                    onClick={() => {
                      handleReject(request.requestId);
                      setAcceptRequestTabOpen();
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
