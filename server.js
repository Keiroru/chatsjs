import express from "express";
import mysql from "mysql2";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { getConnection } from './src/lib/db.js';

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
  console.log("New client connected:", socket.id);

  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  socket.on("delete_message", (data) => {
    io.emit("delete", data);
  });

  socket.on("friend_request", (data) => {
    io.emit("receive_request", data);
  });

  socket.on("accept_request", (data) => {
    io.emit("receive_accept", data);
  });

  socket.on("block_friend", (data) => {
    io.emit("block", data);
  });

  socket.on("delete_friend", (data) => {
    io.emit("friend_delete", data)
  });

  socket.on("unblock_friend", (data) => {
    io.emit("unblock", data);
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