import { useState, useEffect, useRef } from 'react';
import { setMessageHandler, sendSignIn, sendStartStreaming, sendOffer, sendAnswer, sendIceCandidates, sendEndCall } from '../services/socketService';

export const useWebRTC = (username, localVideoRef, remoteVideoRef) => {
  const [isConnected, setIsConnected] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  
  const peerConnectionRef = useRef(null);
  const currentTargetRef = useRef(null);

  useEffect(() => {
    if (username) {
      // Send sign in when username is set
      sendSignIn(username);
    }
  }, [username]);

  useEffect(() => {
    // Set up message handler
    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 Received message:', data);
        
        switch (data.type) {
          case 'StartStreaming':
            handleConnectionRequest(data);
            break;
          case 'Offer':
            handleOffer(data);
            break;
          case 'Answer':
            handleAnswer(data);
            break;
          case 'IceCandidates':
            handleIceCandidate(data);
            break;
          case 'EndCall':
            handleEndCall();
            break;
          default:
            console.log('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    // Set the message handler
    setMessageHandler(handleMessage);

    return () => {
      // Clean up message handler
      setMessageHandler(null);
    };
  }, []); // Remove dependencies to avoid the initialization error

  const createPeerConnection = () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    const pc = new RTCPeerConnection(configuration);
    
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendIceCandidates(username, currentTargetRef.current, JSON.stringify(event.candidate));
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
      if (pc.connectionState === 'connected') {
        setIsConnected(true);
      } else if (pc.connectionState === 'disconnected') {
        setIsConnected(false);
      }
    };

    return pc;
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' },
        audio: false
      });

      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (error) {
      console.error('Error starting screen share:', error);
      throw error;
    }
  };

  const stopScreenShare = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
    }
  };

  const callUser = async (target) => {
    try {
      currentTargetRef.current = target;
      const peerConnection = createPeerConnection();
      peerConnectionRef.current = peerConnection;

      if (localStream) {
        localStream.getTracks().forEach(track => {
          peerConnection.addTrack(track, localStream);
        });
      }

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      sendOffer(username, target, offer.sdp);
      sendStartStreaming(username, target);
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const handleConnectionRequest = (data) => {
    console.log('Connection request from:', data.username);
    // This will be handled by the UI component
    // You can add a callback here if needed
  };

  const handleOffer = async (data) => {
    try {
      const peerConnection = createPeerConnection();
      peerConnectionRef.current = peerConnection;
      currentTargetRef.current = data.username;

      if (localStream) {
        localStream.getTracks().forEach(track => {
          peerConnection.addTrack(track, localStream);
        });
      }

      await peerConnection.setRemoteDescription(new RTCSessionDescription({
        type: 'offer',
        sdp: data.data
      }));

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      sendAnswer(username, data.username, answer.sdp);
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };

  const handleAnswer = async (data) => {
    try {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription({
          type: 'answer',
          sdp: data.data
        }));
      }
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  };

  const handleIceCandidate = async (data) => {
    try {
      if (peerConnectionRef.current) {
        const candidate = JSON.parse(data.data);
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  };

  const handleEndCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    if (currentTargetRef.current) {
      sendEndCall(username, currentTargetRef.current);
      currentTargetRef.current = null;
    }
    
    setIsConnected(false);
    setRemoteStream(null);
    
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  const acceptCall = () => {
    // Call is already accepted when we handle the offer
    console.log('Call accepted');
  };

  const declineCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    currentTargetRef.current = null;
  };

  const endCall = () => {
    handleEndCall();
  };

  return {
    startScreenShare,
    stopScreenShare,
    callUser,
    acceptCall,
    declineCall,
    endCall,
    isConnected,
    localStream,
    remoteStream
  };
};
