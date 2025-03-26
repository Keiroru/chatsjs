// signaling-server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('a user connected');

  // Relay signaling messages between clients
  socket.on('signal', (data) => {
    io.to(data.to).emit('signal', data); // Send signal to the recipient client
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3002, () => {
  console.log('Signaling server running on port 3001');
});
