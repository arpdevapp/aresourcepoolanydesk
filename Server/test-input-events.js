const WebSocket = require('websocket').w3cwebsocket;

// Test script to verify input event handling
const testInputEvents = () => {
    const ws = new WebSocket('ws://192.168.1.9:3000');
    
    ws.onopen = () => {
        console.log('✅ Connected to WebSocket server');
        
        // Test sign in
        const signInMessage = {
            type: 'SignIn',
            username: 'test_user',
            data: null
        };
        
        console.log('📤 Sending sign in message...');
        ws.send(JSON.stringify(signInMessage));
        
        // Wait a bit then test input events
        setTimeout(() => {
            console.log('📤 Testing input events...');
            
            // Test touch event
            const touchEvent = {
                type: 'TouchEvent',
                username: 'test_user',
                target: 'android_device',
                data: {
                    action: 0, // TOUCH_DOWN
                    x: 100.5,
                    y: 200.3,
                    pressure: 1.0,
                    size: 1.0,
                    pointerId: 0,
                    timestamp: Date.now()
                }
            };
            
            console.log('👆 Sending touch event...');
            ws.send(JSON.stringify(touchEvent));
            
            // Test key event
            const keyEvent = {
                type: 'KeyEvent',
                username: 'test_user',
                target: 'android_device',
                data: {
                    action: 0, // KEY_DOWN
                    keyCode: 66, // 'B' key
                    metaState: 0,
                    timestamp: Date.now()
                }
            };
            
            console.log('⌨️ Sending key event...');
            ws.send(JSON.stringify(keyEvent));
            
            // Test mouse event
            const mouseEvent = {
                type: 'MouseEvent',
                username: 'test_user',
                target: 'android_device',
                data: {
                    action: 0, // MOUSE_DOWN
                    x: 150.0,
                    y: 250.0,
                    button: 1, // Left button
                    scrollDelta: 0,
                    timestamp: Date.now()
                }
            };
            
            console.log('🖱️ Sending mouse event...');
            ws.send(JSON.stringify(mouseEvent));
            
        }, 1000);
        
        // Close connection after tests
        setTimeout(() => {
            console.log('🔌 Closing connection...');
            ws.close();
        }, 3000);
    });
    
    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('📨 Received message:', message);
    };
    
    ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
    };
    
    ws.onclose = () => {
        console.log('🔌 Connection closed');
    };
};

// Run the test
console.log('🚀 Starting input events test...');
testInputEvents();
