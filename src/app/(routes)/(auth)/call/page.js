"use client"
import { useEffect } from 'react';
import { initializeWebRTC, startCall } from '../../../components/call/webrtc';

const ChatPage = () => {
  useEffect(() => {
    // Initialize WebRTC with signaling server URL
    initializeWebRTC('http://localhost:3001'); // Adjust for production
  }, []);

  return (
    <div>
      <h1>Chat with Call Feature</h1>

      <video id="local-video" autoPlay muted style={{ width: '300px' }}></video>
      <video id="remote-video" autoPlay style={{ width: '300px' }}></video>

      <button onClick={startCall}>Start Call</button>
    </div>
  );
};

export default ChatPage;
