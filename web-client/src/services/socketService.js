// WebSocket service for real-time communication

// Dynamic WebSocket URL based on environment
const getSocketUrl = () => {
  // If running on HTTPS (production), use the deployed server
  if (window.location.protocol === 'https:') {
    return 'wss://aresourcepool-websocket-server.onrender.com';
  }
  // For local development (HTTP), use local WebSocket
  return 'ws://localhost:3000';
};

let socket;
let reconnectAttempts = 0;
const maxReconnectAttempts = 3;

const createWebSocketConnection = () => {
  const SOCKET_URL = getSocketUrl();
  console.log('🔌 Attempting to connect to:', SOCKET_URL);
  
  socket = new WebSocket(SOCKET_URL);
  return socket;
};

// Setup event handlers for WebSocket
const setupEventHandlers = () => {
  socket.onopen = () => {
    console.log('✅ WebSocket connected successfully');
    reconnectAttempts = 0; // Reset reconnection attempts on successful connection
  };

  socket.onclose = () => {
    console.log('❌ WebSocket connection closed');
  };

  socket.onerror = (error) => {
    console.error('❌ WebSocket error:', error);
    console.log('🔄 Attempting to reconnect...');
    
    if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts++;
      setTimeout(() => {
        console.log(`🔄 Reconnection attempt ${reconnectAttempts}/${maxReconnectAttempts}`);
        socket = createWebSocketConnection();
        setupEventHandlers();
      }, 2000 * reconnectAttempts); // Exponential backoff
    } else {
      console.error('❌ Max reconnection attempts reached. Please check your server connection.');
      // Show user-friendly error message
      alert('Unable to connect to server. Please ensure the server is running and try refreshing the page.');
    }
  };
};

// Create initial WebSocket connection
socket = createWebSocketConnection();
setupEventHandlers();

// Message handler - will be set by components
let messageHandler = null;

// Set message handler
export const setMessageHandler = (handler) => {
  messageHandler = handler;
  socket.onmessage = (event) => {
    if (messageHandler) {
      messageHandler(event);
    }
  };
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

// Helper function to send TouchEvent message
export const sendTouchEvent = (username, target, touchData) => {
  sendMessage({
    type: 'TouchEvent',
    username: username,
    target: target,
    data: touchData
  });
};

// Helper function to send KeyEvent message
export const sendKeyEvent = (username, target, keyData) => {
  sendMessage({
    type: 'KeyEvent',
    username: username,
    target: target,
    data: keyData
  });
};

// Helper function to send MouseEvent message
export const sendMouseEvent = (username, target, mouseData) => {
  sendMessage({
    type: 'MouseEvent',
    username: username,
    target: target,
    data: mouseData
  });
};

export { socket };
