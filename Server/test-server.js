const WebSocket = require('websocket').client;

console.log('🧪 Testing WebSocket server connection...');

const client = new WebSocket();

client.on('connectFailed', function(error) {
    console.log('❌ Connection failed:', error.toString());
});

client.on('connect', function(connection) {
    console.log('✅ WebSocket connected successfully!');
    
    // Test SignIn message
    const signInMessage = {
        type: 'SignIn',
        username: 'testuser',
        data: null
    };
    
    console.log('📤 Sending SignIn message:', JSON.stringify(signInMessage));
    connection.send(JSON.stringify(signInMessage));
    
    // Listen for messages
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('📨 Received message:', message.utf8Data);
        }
    });
    
    // Test disconnection after 5 seconds
    setTimeout(() => {
        console.log('🔌 Disconnecting test client...');
        connection.close();
        process.exit(0);
    }, 5000);
});

// Connect to the server
console.log('🔌 Attempting to connect to ws://192.168.1.7:3000...');
client.connect('ws://192.168.1.7:3000');
