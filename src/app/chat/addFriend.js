"use client";

import { useState } from "react";

export default function AddFriend({ userId }) {
  const [receiverUserId, setUserId] = useState("");

  const handleAddFriend = async () => {
    try {
      await fetch("/api/addFriend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderUserId: userId,
          receiverUserId: receiverUserId,
        }),
      });
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  return (
    <div className="add-friend">
      <h2>Add a friend</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="user Id..."
          aria-label="Search for a user"
          value={receiverUserId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button onClick={handleAddFriend}>Add friend</button>
      </div>
    </div>
  );
}
