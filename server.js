import express from "express";
import mysql from "mysql2";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { getConnection } from "./src/lib/db.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const connectedUsers = {};

io.on("connection", (socket) => {
  socket.on("join_conversation", ({ conversationId }) => {
    console.log("joined conversation", conversationId);
    socket.join(conversationId);
  });

  socket.on("otherJoin_conversation", ({ conversationId, userId }) => {
    const recipientSocket = connectedUsers[userId]?.socketId;
    if (recipientSocket) {
      const socketInstance = io.sockets.sockets.get(recipientSocket);
      if (socketInstance) {
        socketInstance.join(conversationId);
        console.log(`User ${userId} joined conversation ${conversationId}`);
      } else {
        console.log(`Socket instance not found for userId: ${userId}`);
      }
    } else {
      console.log(`Recipient socket not found for userId: ${userId}`);
    }
  });

  socket.on("joinAll_conversations", (data) => {
    data.forEach((conversationId) => {
      socket.join(conversationId);
    });
  });

  socket.on("create_group_chat", (data) => {
    const { conversationId, userIds } = data;
    socket.join(conversationId);

    if (Array.isArray(userIds)) {
      userIds.forEach((userId) => {
        const receiverSocket = connectedUsers[userId]?.socketId;
        if (receiverSocket) {
          const socketInstance = io.sockets.sockets.get(receiverSocket);
          if (socketInstance) {
            socketInstance.join(conversationId);
          } else {
            console.log(`user ${userId} is offline no further action needed`);
          }
        }
      });
    }
  });

  socket.on("show_group_chat", (data) => {
    const { userIds, conversationName, conversationId, createdAt } = data;

    if (Array.isArray(userIds)) {
      userIds.forEach((userId) => {
        const receiverSocket = connectedUsers[userId]?.socketId;
        if (receiverSocket) {
          const socketInstance = io.sockets.sockets.get(receiverSocket);
          if (socketInstance) {
            socketInstance.emit("render_group_chat", {
              conversationName: conversationName,
              conversationId: conversationId,
              createdAt: createdAt
            });
          } else {
            console.log(`user ${userId} is offline no further action needed`);
          }
        }
      });
    }
  });

  socket.on("leave_conversation", ({ conversationId }) => {
    socket.leave(conversationId);
  });

  socket.on("send_message", (data) => {
    socket.to(data.conversationId).emit("receive_message", data);
  });

  socket.on("message_seen", (data) => {
    const { messageId, conversationId, senderId } = data;

    socket
      .to(conversationId)
      .emit("message_seen", { messageId, conversationId, senderId });
  });

  socket.on("message_state_update", (data) => {
    const { messageId, conversationId, state, senderId } = data;

    socket.to(conversationId).emit("message_state_update", {
      messageId,
      conversationId,
      state,
      senderId,
    });
  });

  socket.on("delete_message", (data) => {
    socket.to(data.conversationId).emit("delete", data);
  });

  socket.on("friend_request", (data) => {
    const recipientSocket = connectedUsers[data.receiverUserId]?.socketId;
    socket.to(recipientSocket).emit("receive_request", data);
  });

  socket.on("accept_request", (data) => {
    const recipientSocket = connectedUsers[data.sender.userId]?.socketId;
    socket.to(recipientSocket).emit("receive_accept", data);
    socket.join(data.conversationId);
  });

  socket.on("block_friend", (data) => {
    const blockedSocket = connectedUsers[data.blocked]?.socketId;
    socket.to(blockedSocket).emit("block", data);
    socket.emit("block", data);
  });

  socket.on("delete_friend", (data) => {
    const friendSocket = connectedUsers[data.deleted]?.socketId;
    socket.to(friendSocket).emit("friend_delete", data);
  });

  socket.on("edit_message", (data) => {
    socket.to(data.conversationId).emit("receive_edit", data);
  });

  socket.on("unblock_friend", (data) => {
    const unblockedSocket = connectedUsers[data.unBlocked]?.socketId;
    socket.to(unblockedSocket).emit("unblock", data);
    socket.emit("unblock", data);
  });

  socket.on("user_status", ({ userId, status }) => {
    connectedUsers[userId] = { socketId: socket.id, status: status };

    io.emit("friend_status_change", {
      userId,
      status,
      isOnline: status === "online",
    });
  });

  socket.on("disconnect", () => {
    const userEntry = Object.entries(connectedUsers).find(
      ([, data]) => data.socketId === socket.id
    );

    if (userEntry) {
      const [disconnectedUserId] = userEntry;

      delete connectedUsers[disconnectedUserId];

      io.emit("friend_status_change", {
        userId: disconnectedUserId,
        status: "offline",
        isOnline: false,
      });
    }

    console.log("Client disconnected:", socket.id);
  });
});

async function startServer() {
  try {
    const db = await getConnection();

    db.connect((err) => {
      if (err) {
        console.error("Database connection failed:", err.stack);
        return;
      }
      console.log("Connected to database");
    });

    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();
