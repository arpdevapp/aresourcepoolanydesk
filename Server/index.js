const http = require("http")
const socket = require("websocket").server

// Create HTTP server with CORS headers
const server = http.createServer((req, res) => {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket server is running');
})

// Get the actual IP address the server is listening on
const serverIP = '192.168.1.7';
const serverPort = 3000;

server.listen(serverPort, serverIP, () => {
    console.log('=== WebSocket Server Started ===');
    console.log(`Server is running on port ${serverPort}`);
    console.log(`Server is accessible at: http://${serverIP}:${serverPort}`);
    console.log(`WebSocket endpoint: ws://${serverIP}:${serverPort}`);
    console.log('================================');
})

const users = []

const Types = {
    SignIn: "SignIn",
    StartStreaming: "StartStreaming" ,
    UserFoundSuccessfully: "UserFoundSuccessfully",
    Offer: "Offer",
    Answer: "Answer",
    IceCandidates: "IceCandidates",
    EndCall: "EndCall",
}

const webSocket = new socket({httpServer: server})

webSocket.on('request', (req) => {
    console.log(`\n=== New WebSocket Connection Request ===`);
    console.log(`Remote Address: ${req.remoteAddress}`);
    console.log(`Origin: ${req.origin || 'No origin'}`);
    console.log(`Requested URL: ${req.resourceURL}`);
    
    try {
        const connection = req.accept();
        console.log(`✅ WebSocket connection accepted from: ${req.remoteAddress}`);
        
        // Add connection error handling
        connection.on('error', (error) => {
            console.error(`❌ WebSocket connection error: ${error.message}`);
        });

        connection.on('message', (message) => {
            try {
                if (!message.utf8Data) {
                    console.warn('⚠️ Received empty message');
                    return;
                }
                
                const data = JSON.parse(message.utf8Data);
                console.log(`📨 Received message:`, JSON.stringify(data, null, 2));
                
                const currentUser = findUser(data.username)
                const userToReceive = findUser(data.target)
                
                switch (data.type) {
                    case Types.SignIn:
                        console.log(`🔐 SignIn attempt for user: ${data.username}`);
                        if (currentUser) {
                            console.log(`⚠️ User ${data.username} already exists, ignoring duplicate signin`);
                            return
                        }

                        users.push({username: data.username, conn: connection, password: data.data})
                        console.log(`✅ User ${data.username} signed in successfully`);
                        console.log(`📊 Total users online: ${users.length}`);
                        break
                        
                    case Types.StartStreaming :
                        console.log(`📹 StartStreaming request from ${data.username} to ${data.target}`);
                        if (userToReceive) {
                            console.log(`📤 Forwarding StartStreaming to ${data.target}`);
                            sendToConnection(userToReceive.conn, {
                                type: Types.StartStreaming,
                                username: currentUser.username,
                                target: userToReceive.username
                            })
                        } else {
                            console.log(`❌ Target user ${data.target} not found`);
                        }
                        break
                        
                    case Types.Offer :
                        console.log(`📤 Offer from ${data.username} to ${data.target}`);
                        if (userToReceive) {
                            sendToConnection(userToReceive.conn, {
                                type: Types.Offer, 
                                username: data.username, 
                                data: data.data
                            })
                        } else {
                            console.log(`❌ Target user ${data.target} not found for Offer`);
                        }
                        break
                        
                    case Types.Answer :
                        console.log(`📤 Answer from ${data.username} to ${data.target}`);
                        if (userToReceive) {
                            sendToConnection(userToReceive.conn, {
                                type: Types.Answer, 
                                username: data.username, 
                                data: data.data
                            })
                        } else {
                            console.log(`❌ Target user ${data.target} not found for Answer`);
                        }
                        break
                        
                    case Types.IceCandidates:
                        console.log(`🧊 IceCandidates from ${data.username} to ${data.target}`);
                        if (userToReceive) {
                            sendToConnection(userToReceive.conn, {
                                type: Types.IceCandidates, 
                                username: data.username, 
                                data: data.data
                            })
                        } else {
                            console.log(`❌ Target user ${data.target} not found for IceCandidates`);
                        }
                        break
                        
                    case Types.EndCall:
                        console.log(`📞 EndCall from ${data.username} to ${data.target}`);
                        if (userToReceive) {
                            sendToConnection(userToReceive.conn, {
                                type: Types.EndCall, 
                                username: data.username
                            })
                        } else {
                            console.log(`❌ Target user ${data.target} not found for EndCall`);
                        }
                        break
                        
                    default:
                        console.log(`❓ Unknown message type: ${data.type}`);
                }
            } catch (e) {
                console.error(`❌ Error processing message: ${e.message}`);
                console.error(`Message content: ${message.utf8Data}`);
            }
        });
        
        connection.on('close', (reasonCode, description) => {
            console.log(`\n=== WebSocket Connection Closed ===`);
            console.log(`Remote Address: ${req.remoteAddress}`);
            console.log(`Reason Code: ${reasonCode}`);
            console.log(`Description: ${description}`);
            
            // Find and remove the disconnected user
            const disconnectedUser = users.find(user => user.conn === connection);
            if (disconnectedUser) {
                console.log(`👤 User ${disconnectedUser.username} disconnected`);
                const index = users.indexOf(disconnectedUser);
                users.splice(index, 1);
                console.log(`📊 Total users online: ${users.length}`);
            } else {
                console.log(`⚠️ Disconnected user not found in users list`);
            }
            console.log('=====================================');
        });
        
    } catch (error) {
        console.error(`❌ Error accepting WebSocket connection: ${error.message}`);
    }
});

const sendToConnection = (connection, message) => {
    try {
        const messageStr = JSON.stringify(message);
        connection.send(messageStr);
        console.log(`📤 Sent message: ${messageStr}`);
    } catch (error) {
        console.error(`❌ Error sending message: ${error.message}`);
    }
}

const findUser = username => {
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username) return users[i]
    }
    return null;
}

// Add graceful shutdown handling
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

// Log server status periodically
setInterval(() => {
    console.log(`📊 Server Status - Users online: ${users.length}, Memory: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
}, 30000); // Every 30 seconds
