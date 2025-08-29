// WebSocket service for real-time communication

const SOCKET_URL = 'ws://192.168.1.7:3000';

// Create WebSocket connection
const socket = new WebSocket(SOCKET_URL);

socket.onopen = () => {
  console.log('✅ WebSocket connected successfully');
};

socket.onclose = () => {
  console.log('❌ WebSocket connection closed');
};

socket.onerror = (error) => {
  console.error('❌ WebSocket error:', error);
};

// Helper function to send messages
export const sendMessage = (message) => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.error('WebSocket is not open');
  }
};

// Helper function to send SignIn message
export const sendSignIn = (username) => {
  sendMessage({
    type: 'SignIn',
    username: username,
    data: null
  });
};

// Helper function to send StartStreaming message
export const sendStartStreaming = (username, target) => {
  sendMessage({
    type: 'StartStreaming',
    username: username,
    target: target,
    data: null
  });
};

// Helper function to send Offer message
export const sendOffer = (username, target, data) => {
  sendMessage({
    type: 'Offer',
    username: username,
    target: target,
    data: data
  });
};

// Helper function to send Answer message
export const sendAnswer = (username, target, data) => {
  sendMessage({
    type: 'Answer',
    username: username,
    target: target,
    data: data
  });
};

// Helper function to send IceCandidates message
export const sendIceCandidates = (username, target, data) => {
  sendMessage({
    type: 'IceCandidates',
    username: username,
    target: target,
    data: data
  });
};

// Helper function to send EndCall message
export const sendEndCall = (username, target) => {
  sendMessage({
    type: 'EndCall',
    username: username,
    target: target,
    data: null
  });
};

export { socket };
