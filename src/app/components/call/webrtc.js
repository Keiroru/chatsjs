// utils/webrtc.js
import io from 'socket.io-client';

let peerConnection;
let localStream;
let remoteStream;
let socket;

const constraints = {
  audio: true,
  video: true,
};

export const initializeWebRTC = (socketUrl) => {
  socket = io(socketUrl);

  socket.on('signal', handleSignal);

  // Create a new peer connection
  peerConnection = new RTCPeerConnection();

  // Add ICE candidate collection
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('signal', { to: 'remoteClient', candidate: event.candidate });
    }
  };

  // Handle remote stream
  peerConnection.ontrack = (event) => {
    remoteStream = event.streams[0];
    document.getElementById('remote-video').srcObject = remoteStream;
  };
};

export const startCall = () => {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      localStream = stream;
      document.getElementById('local-video').srcObject = localStream;

      // Add tracks to the peer connection
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });

      // Create and send an offer
      peerConnection
        .createOffer()
        .then((offer) => peerConnection.setLocalDescription(offer))
        .then(() => {
          socket.emit('signal', { to: 'remoteClient', offer: peerConnection.localDescription });
        });
    })
    .catch((err) => {
      console.error('Error accessing media devices:', err);
    });
};

export const handleSignal = (data) => {
  if (data.offer) {
    peerConnection
      .setRemoteDescription(new RTCSessionDescription(data.offer))
      .then(() => peerConnection.createAnswer())
      .then((answer) => peerConnection.setLocalDescription(answer))
      .then(() => {
        socket.emit('signal', { to: 'remoteClient', answer: peerConnection.localDescription });
      });
  } else if (data.answer) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
  } else if (data.candidate) {
    peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
  }
};
