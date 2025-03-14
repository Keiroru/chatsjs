import { useEffect, useState } from "react";
import "./chat.css";

export default function FriendRequests({ userData }) {
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    async function fetchFriendRequests() {
      try {
        const response = await fetch(
          `/api/friendRequest?receiverUserId=${userData.userId}`
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
    }
  }, [userData.userId]);

  const handleAccept = async (requestId) => {
    try {
      await fetch("/api/acceptFriendRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId }),
      });
      window.location.reload();
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await fetch("/api/rejectFriendRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId }),
      });
      window.location.reload();
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  return (
    <div className="friend-requests-container">
      {friendRequests.length > 0 && (
        <div className="friend-requests-header">Pending Friend Requests</div>
      )}
      {friendRequests.map((friendRequest) => (
        <div key={friendRequest.requestId} className="friend-request-card">
          <h3 className="friend-request-name">{friendRequest.displayName}</h3>
          <div className="friend-request-buttons">
            <button
              className="friend-request-accept"
              onClick={() => handleAccept(friendRequest.requestId)}
            >
              Accept
            </button>
            <button
              className="friend-request-reject"
              onClick={() => handleReject(friendRequest.requestId)}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
