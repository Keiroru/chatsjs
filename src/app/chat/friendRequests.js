import { useEffect, useState } from "react";

export default function FriendRequests({ userData }) {
  const [friendRequests, setFriendRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
      }
    }

    if (userData.userId) {
      fetchFriendRequests();
    }
  }, [userData.userId]);

  const handleAccept = async (requestId) => {
    try {
      const response = await fetch("/api/acceptFriendRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId }),
      });
      if (!response.ok) throw new Error("Failed to accept friend request");
      setFriendRequests(
        friendRequests.filter((request) => request.id !== requestId)
      );
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {friendRequests.length > 0 && <div>Pending friend requests</div>}
      {friendRequests.map((friendRequest) => (
        <div key={friendRequest.requestId}>
          <h3>{friendRequest.displayName}</h3>
          <button onClick={() => handleAccept(friendRequest.requestId)}>
            Accept friend request
          </button>
          <button>Reject friend request</button>
        </div>
      ))}
    </>
  );
}
