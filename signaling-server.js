const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (for testing)
    methods: ["GET", "POST"]
  }
});

let users = {}; // Store connected users

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Add the user
  users[socket.id] = socket.id;

  // Send the updated user list to everyone
  io.emit('update-user-list', Object.keys(users));

  // Handle signaling messages
  socket.on('signal', (data) => {
    const { to, offer, answer, candidate } = data;
    if (users[to]) {
      io.to(to).emit('signal', { from: socket.id, offer, answer, candidate });
    }
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    delete users[socket.id];

    // Send updated user list
    io.emit('update-user-list', Object.keys(users));
  });
});

server.listen(3002, () => {
  console.log('Signaling server running on port 3002');
});
