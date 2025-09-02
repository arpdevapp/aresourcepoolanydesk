import { useRef, useCallback } from 'react';
import { sendTouchEvent, sendKeyEvent, sendMouseEvent } from '../services/socketService';

// Input event constants
export const InputActions = {
  // Touch actions
  TOUCH_DOWN: 0,
  TOUCH_UP: 1,
  TOUCH_MOVE: 2,
  TOUCH_CANCEL: 3,
  
  // Key actions
  KEY_DOWN: 0,
  KEY_UP: 1,
  
  // Mouse actions
  MOUSE_DOWN: 0,
  MOUSE_UP: 1,
  MOUSE_MOVE: 2,
  MOUSE_SCROLL: 3,
  MOUSE_CLICK: 4,
  
  // Mouse buttons
  MOUSE_LEFT: 1,
  MOUSE_RIGHT: 2,
  MOUSE_MIDDLE: 4
};

export const useInputEvents = (username, targetUser, isConnected = false) => {
  const videoRef = useRef(null);
  const isInputEnabled = useRef(false);

  const enableInput = useCallback(() => {
    isInputEnabled.current = true;
  }, []);

  const disableInput = useCallback(() => {
    isInputEnabled.current = false;
  }, []);

  const handleTouchStart = useCallback((event) => {
    if (!isInputEnabled.current || !isConnected || !targetUser) return;
    
    event.preventDefault();
    const rect = videoRef.current?.getBoundingClientRect();
    if (!rect) return;

    const touch = event.touches[0];
    const touchData = {
      action: InputActions.TOUCH_DOWN,
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
      pressure: touch.force || 1.0,
      size: 1.0,
      pointerId: touch.identifier,
      timestamp: Date.now()
    };

    sendTouchEvent(username, targetUser, touchData);
  }, [username, targetUser, isConnected]);

  const handleTouchMove = useCallback((event) => {
    if (!isInputEnabled.current || !isConnected || !targetUser) return;
    
    event.preventDefault();
    const rect = videoRef.current?.getBoundingClientRect();
    if (!rect) return;

    const touch = event.touches[0];
    const touchData = {
      action: InputActions.TOUCH_MOVE,
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
      pressure: touch.force || 1.0,
      size: 1.0,
      pointerId: touch.identifier,
      timestamp: Date.now()
    };

    sendTouchEvent(username, targetUser, touchData);
  }, [username, targetUser, isConnected]);

  const handleTouchEnd = useCallback((event) => {
    if (!isInputEnabled.current || !isConnected || !targetUser) return;
    
    event.preventDefault();
    const rect = videoRef.current?.getBoundingClientRect();
    if (!rect) return;

    const touch = event.changedTouches[0];
    const touchData = {
      action: InputActions.TOUCH_UP,
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
      pressure: touch.force || 1.0,
      size: 1.0,
      pointerId: touch.identifier,
      timestamp: Date.now()
    };

    sendTouchEvent(username, targetUser, touchData);
  }, [username, targetUser, isConnected]);

  const handleMouseDown = useCallback((event) => {
    if (!isInputEnabled.current || !isConnected || !targetUser) return;
    
    event.preventDefault();
    const rect = videoRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseData = {
      action: InputActions.MOUSE_DOWN,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      button: event.button + 1, // Convert to 1-based button numbering
      timestamp: Date.now()
    };

    sendMouseEvent(username, targetUser, mouseData);
  }, [username, targetUser, isConnected]);

  const handleMouseMove = useCallback((event) => {
    if (!isInputEnabled.current || !isConnected || !targetUser) return;
    
    event.preventDefault();
    const rect = videoRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseData = {
      action: InputActions.MOUSE_MOVE,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      button: 0,
      timestamp: Date.now()
    };

    sendMouseEvent(username, targetUser, mouseData);
  }, [username, targetUser, isConnected]);

  const handleMouseUp = useCallback((event) => {
    if (!isInputEnabled.current || !isConnected || !targetUser) return;
    
    event.preventDefault();
    const rect = videoRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseData = {
      action: InputActions.MOUSE_UP,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      button: event.button + 1,
      timestamp: Date.now()
    };

    sendMouseEvent(username, targetUser, mouseData);
  }, [username, targetUser, isConnected]);

  const handleWheel = useCallback((event) => {
    if (!isInputEnabled.current || !isConnected || !targetUser) return;
    
    event.preventDefault();
    const rect = videoRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseData = {
      action: InputActions.MOUSE_SCROLL,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      button: 0,
      scrollDelta: event.deltaY,
      timestamp: Date.now()
    };

    sendMouseEvent(username, targetUser, mouseData);
  }, [username, targetUser, isConnected]);

  const handleKeyDown = useCallback((event) => {
    if (!isInputEnabled.current || !isConnected || !targetUser) return;
    
    const keyData = {
      action: InputActions.KEY_DOWN,
      keyCode: event.keyCode,
      metaState: 0, // Could be enhanced to include modifier keys
      timestamp: Date.now()
    };

    sendKeyEvent(username, targetUser, keyData);
  }, [username, targetUser, isConnected]);

  const handleKeyUp = useCallback((event) => {
    if (!isInputEnabled.current || !isConnected || !targetUser) return;
    
    const keyData = {
      action: InputActions.KEY_UP,
      keyCode: event.keyCode,
      metaState: 0,
      timestamp: Date.now()
    };

    sendKeyEvent(username, targetUser, keyData);
  }, [username, targetUser, isConnected]);

  const setupInputListeners = useCallback((videoElement) => {
    if (!videoElement) return;

    videoRef.current = videoElement;

    // Touch events
    videoElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    videoElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    videoElement.addEventListener('touchend', handleTouchEnd, { passive: false });
    videoElement.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    // Mouse events
    videoElement.addEventListener('mousedown', handleMouseDown, { passive: false });
    videoElement.addEventListener('mousemove', handleMouseMove, { passive: false });
    videoElement.addEventListener('mouseup', handleMouseUp, { passive: false });
    videoElement.addEventListener('wheel', handleWheel, { passive: false });

    // Keyboard events (on the document to capture all key events)
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      // Cleanup function
      videoElement.removeEventListener('touchstart', handleTouchStart);
      videoElement.removeEventListener('touchmove', handleTouchMove);
      videoElement.removeEventListener('touchend', handleTouchEnd);
      videoElement.removeEventListener('touchcancel', handleTouchEnd);
      videoElement.removeEventListener('mousedown', handleMouseDown);
      videoElement.removeEventListener('mousemove', handleMouseMove);
      videoElement.removeEventListener('mouseup', handleMouseUp);
      videoElement.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseDown, handleMouseMove, handleMouseUp, handleWheel, handleKeyDown, handleKeyUp]);

  return {
    setupInputListeners,
    enableInput,
    disableInput,
    isInputEnabled: isInputEnabled.current
  };
};

