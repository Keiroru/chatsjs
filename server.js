const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

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

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chatdb",
  charset: "utf8mb4",
});

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
