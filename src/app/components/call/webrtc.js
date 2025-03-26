import io from 'socket.io-client';

let peerConnection;
let localStream;
let remoteStream;
let socket;
let userId = null; // Store this client's socket ID

const constraints = {
  audio: true,
  video: true,
};

export const initializeWebRTC = (socketUrl) => {
  socket = io(socketUrl);

  socket.on('connect', () => {
    userId = socket.id; // Store this client's ID
    console.log('Connected with ID:', userId);
  });

  socket.on('user-joined', ({ userId }) => {
    console.log(`User joined: ${userId}`);
  });

  socket.on('signal', handleSignal);

  peerConnection = new RTCPeerConnection();

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('signal', { to: userId, candidate: event.candidate });
    }
  };

  peerConnection.ontrack = (event) => {
    remoteStream = event.streams[0];
    document.getElementById('remote-video').srcObject = remoteStream;
  };
};

export const startCall = (targetUserId) => {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      localStream = stream;
      document.getElementById('local-video').srcObject = localStream;

      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });

      peerConnection
        .createOffer()
        .then((offer) => peerConnection.setLocalDescription(offer))
        .then(() => {
          socket.emit('signal', { to: targetUserId, offer: peerConnection.localDescription });
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
        socket.emit('signal', { to: data.from, answer: peerConnection.localDescription });
      });
  } else if (data.answer) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
  } else if (data.candidate) {
    peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
  }
};
