"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocialContext = createContext();
const SocketContext = createContext(null);

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io("http://localhost:3001", {
      withCredentials: true,
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export function SocialProvider({ children, userData }) {
  const [friends, setFriends] = useState([]);
  const socket = useSocket();

  const handleUnload = async () => {
    if (!userData?.userId) return;

    try {
      const res = await fetch(`/api/auth/unload?userId=${userData.userId}`, {
        method: "POST",
      });
      if (res.ok) {
        console.log("Unload successful");
      } else {
        console.error("Unload failed");
      }
    } catch (error) {
      console.error("Error during unload:", error);
    }
  };

  const handleLoad = async () => {
    if (!userData?.userId) return;

    try {
      const res = await fetch(`/api/auth/load?userId=${userData.userId}`, {
        method: "POST",
      });
      if (res.ok) {
        console.log("Load successful");
      } else {
        console.error("Load failed");
      }
    } catch (error) {
      console.error("Error during load:", error);
    }
  };

  useEffect(() => {
    if (!socket || !userData?.userId) return;

    console.log("Setting up socket listeners in StatusContext");

    handleLoad();

    socket.emit("user_status", {
      userId: userData.userId,
      status: "online",
    });

    const handleBeforeUnload = () => {
      socket.emit("user_status", {
        userId: userData.userId,
        status: "offline",
      });
      handleUnload();
    };

    const handleFriendStatusChange = ({ userId, status }) => {
      console.log("Friend status change:", userId, status);
      setFriends((oldFriends) =>
        oldFriends.map((f) =>
          f.friendId === userId
            ? {
              ...f,
              status,
              isOnline: status === "online",
            }
            : f
        )
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    socket.on("friend_status_change", handleFriendStatusChange);

    return () => {
      if (socket && userData?.userId) {
        socket.emit("user_status", {
          userId: userData.userId,
          status: "offline",
        });
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
      socket.off("friend_status_change", handleFriendStatusChange);
    };
  }, [socket, userData?.userId]);

  return (
    <SocialContext.Provider
      value={{
        friends,
        setFriends,
        userData,
      }}
    >
      {children}
    </SocialContext.Provider>
  );
}

export function useStatus() {
  return useContext(SocialContext);
}
