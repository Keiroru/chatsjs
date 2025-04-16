"use client";
import { useEffect, useState } from 'react';
import { initializeWebRTC, startCall } from '../../../components/call/webrtc';
import io from 'socket.io-client';

const socket = io('http://localhost:3002');

const ChatPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    initializeWebRTC('http://localhost:3002');

    socket.on('update-user-list', (userList) => {
      setUsers(userList.filter((id) => id !== socket.id)); // Remove self from the list
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Chat with Call Feature</h1>

      <video id="local-video" autoPlay muted style={{ width: '300px' }}></video>
      <video id="remote-video" autoPlay style={{ width: '300px' }}></video>

      <h2>Connected Users</h2>
      <ul>
        {users.map((userId) => (
          <li key={userId}>
            {userId} <button onClick={() => startCall(userId)}>Call</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatPage;
