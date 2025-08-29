import React, { useState, useEffect, useRef } from 'react';
import './MainApp.css';
import { socket } from '../services/socketService';
import { useWebRTC } from '../hooks/useWebRTC';

const MainApp = ({ username, onLogout }) => {
  const [targetUser, setTargetUser] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [notification, setNotification] = useState(null);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  
  const { 
    startScreenShare, 
    stopScreenShare, 
    callUser, 
    acceptCall, 
    declineCall,
    endCall
  } = useWebRTC(username, localVideoRef, remoteVideoRef);

  useEffect(() => {
    // Socket event listeners
    socket.on('connectionRequest', (data) => {
      setNotification({
        type: 'connection',
        from: data.username,
        message: `${data.username} is requesting to connect`
      });
    });

    socket.on('callEnded', () => {
      setConnectionStatus('disconnected');
      setNotification(null);
    });

    return () => {
      socket.off('connectionRequest');
      socket.off('callEnded');
    };
  }, []);

  const handleStartSharing = async () => {
    if (!targetUser.trim()) {
      alert('Please enter a target username');
      return;
    }
    
    try {
      await startScreenShare();
      setIsSharing(true);
      callUser(targetUser);
    } catch (error) {
      console.error('Error starting screen share:', error);
      alert('Failed to start screen sharing');
    }
  };

  const handleStopSharing = () => {
    stopScreenShare();
    setIsSharing(false);
    endCall();
  };

  const handleAcceptCall = () => {
    acceptCall();
    setConnectionStatus('connected');
    setNotification(null);
  };

  const handleDeclineCall = () => {
    declineCall();
    setNotification(null);
  };

  return (
    <div className="main-app">
      <header className="app-header">
        <h2>Welcome, {username}!</h2>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </header>

      <div className="main-content">
        <div className="control-panel">
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter target username"
              value={targetUser}
              onChange={(e) => setTargetUser(e.target.value)}
              className="target-input"
            />
          </div>

          <div className="button-group">
            {!isSharing ? (
              <button 
                onClick={handleStartSharing}
                className="share-btn"
                disabled={!targetUser.trim()}
              >
                Start Screen Share
              </button>
            ) : (
              <button 
                onClick={handleStopSharing}
                className="stop-btn"
              >
                Stop Sharing
              </button>
            )}
          </div>

          <div className="status">
            <p>Status: <span className={`status-${connectionStatus}`}>{connectionStatus}</span></p>
          </div>
        </div>

        <div className="video-container">
          <div className="video-section">
            <h3>Your Screen</h3>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className="local-video"
            />
          </div>

          <div className="video-section">
            <h3>Remote Screen</h3>
            <video
              ref={remoteVideoRef}
              autoPlay
              className="remote-video"
            />
          </div>
        </div>
      </div>

      {/* Connection Request Notification */}
      {notification && (
        <div className="notification-overlay">
          <div className="notification-card">
            <h3>{notification.message}</h3>
            <div className="notification-buttons">
              <button onClick={handleAcceptCall} className="accept-btn">
                Accept
              </button>
              <button onClick={handleDeclineCall} className="decline-btn">
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainApp;
