# Input Events Integration Guide

This guide explains how to use the touch and input event functionality that has been added to the AresourcepoolAnyDesk application.

## Overview

The application now supports bidirectional input event handling between the Android device and web client:

- **Android → Web Client**: Touch events from Android device are captured and sent to the web client
- **Web Client → Android**: Touch, mouse, and keyboard events from web client are sent to Android device

## Architecture

### Components Added

1. **Android Side**:
   - `InputEventService.kt` - Service to capture touch events from Android device
   - `InputEventReceiver.kt` - Service to receive and process input events from web client
   - `InputEventModels.kt` - Data models for input events
   - Updated `DataModel.kt` - Added new event types
   - Updated `MainActivity.kt` - Integration with input event handling

2. **Server Side**:
   - Updated `index.js` - Added handlers for TouchEvent, KeyEvent, and MouseEvent

3. **Web Client Side**:
   - `useInputEvents.js` - Hook for handling input events
   - Updated `MainApp.js` - Integration with input event handling
   - Updated `socketService.js` - Added input event message functions

## How It Works

### 1. Android Touch Capture
- When a connection is established, `InputEventService` creates an overlay view
- The overlay captures touch events and sends them to the web client via WebSocket
- Touch events include position, pressure, size, and action type

### 2. Web Client Input Handling
- When connected, the web client can capture mouse, touch, and keyboard events
- Events are sent to the Android device via WebSocket
- The remote video element acts as the input capture area

### 3. Server Relay
- The server acts as a relay between Android and web client
- Input events are forwarded to the target user based on username

## Usage

### Android App
1. Start the Android app and sign in
2. When a connection is established, touch events are automatically captured
3. The app will receive input events from the web client and simulate them

### Web Client
1. Open the web client and sign in
2. Connect to an Android device
3. Once connected, you'll see input controls
4. Click "Enable Input" to start sending input events
5. Interact with the remote video to control the Android device

## Input Event Types

### Touch Events
- `TOUCH_DOWN` (0) - Finger touches screen
- `TOUCH_UP` (1) - Finger lifts from screen
- `TOUCH_MOVE` (2) - Finger moves on screen
- `TOUCH_CANCEL` (3) - Touch is cancelled

### Key Events
- `KEY_DOWN` (0) - Key is pressed
- `KEY_UP` (1) - Key is released

### Mouse Events
- `MOUSE_DOWN` (0) - Mouse button pressed
- `MOUSE_UP` (1) - Mouse button released
- `MOUSE_MOVE` (2) - Mouse moved
- `MOUSE_SCROLL` (3) - Mouse wheel scrolled
- `MOUSE_CLICK` (4) - Mouse clicked

## Data Models

### TouchEventData
```kotlin
data class TouchEventData(
    val action: Int,
    val x: Float,
    val y: Float,
    val pressure: Float = 1.0f,
    val size: Float = 1.0f,
    val pointerId: Int = 0,
    val timestamp: Long = System.currentTimeMillis()
)
```

### KeyEventData
```kotlin
data class KeyEventData(
    val action: Int,
    val keyCode: Int,
    val metaState: Int = 0,
    val timestamp: Long = System.currentTimeMillis()
)
```

### MouseEventData
```kotlin
data class MouseEventData(
    val action: Int,
    val x: Float,
    val y: Float,
    val button: Int = 0,
    val scrollDelta: Float = 0f,
    val timestamp: Long = System.currentTimeMillis()
)
```

## Permissions Required

### Android Manifest
```xml
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
<uses-permission android:name="android.permission.ACCESSIBILITY_SERVICE" />
```

## Testing

### Server Test
Run the test script to verify server input event handling:
```bash
cd Server
node test-input-events.js
```

### Manual Testing
1. Start the server: `node index.js`
2. Start the Android app and sign in
3. Open the web client and sign in
4. Connect the devices
5. Test touch, mouse, and keyboard input

## Troubleshooting

### Common Issues

1. **Input events not working**:
   - Check if the connection is established
   - Verify input is enabled in the web client
   - Check server logs for message relay

2. **Touch events not captured on Android**:
   - Ensure the overlay permission is granted
   - Check if the service is running
   - Verify WebSocket connection

3. **Web client input not working**:
   - Check if input is enabled
   - Verify the remote video element is available
   - Check browser console for errors

### Debug Logs
- Android: Check logcat for "InputEventService" and "InputEventReceiver" tags
- Server: Check console output for input event messages
- Web Client: Check browser console for input event logs

## Security Considerations

- Input events are only sent between connected users
- No input events are stored or logged permanently
- The system requires explicit user consent to enable input control

## Future Enhancements

- Multi-touch support
- Gesture recognition
- Input event recording and playback
- Custom input mappings
- Accessibility features

