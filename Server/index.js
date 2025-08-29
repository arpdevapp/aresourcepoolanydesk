const http = require("http")
const socket = require("websocket").server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket server is running');
})

server.listen(3000, '192.168.1.7', () => {
    console.log('Server is running on port ')
    console.log('Server is accessible at: http://192.168.1.19:3000')
    console.log('WebSocket endpoint: ws://192.168.1.19:3000')
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
    const connection = req.accept();
    console.log(`New WebSocket connection from: ${req.remoteAddress}`);
    
    // Log the origin for debugging
    if (req.origin) {
        console.log(`Connection origin: ${req.origin}`);
    }

    connection.on('message', (message) => {
        try {
            const data = JSON.parse(message.utf8Data);
            const currentUser = findUser(data.username)
            const userToReceive = findUser(data.target)
            console.log(data)

            switch (data.type) {
                case Types.SignIn:
                    if (currentUser) {
                        return
                    }

                    users.push({username: data.username, conn: connection, password: data.data})
                    break
                case Types.StartStreaming :
                    if (userToReceive) {
                            sendToConnection(userToReceive.conn, {
                                type: Types.StartStreaming,
                                username: currentUser.username,
                                target: userToReceive.username
                            })
                    }
                    break
                case Types.Offer :
                    if (userToReceive) {
                        sendToConnection(userToReceive.conn, {
                            type: Types.Offer, username: data.username, data: data.data
                        })
                    }
                    break
                case Types.Answer :
                    if (userToReceive) {
                        sendToConnection(userToReceive.conn, {
                            type: Types.Answer, username: data.username, data: data.data
                        })
                    }
                    break
                case Types.IceCandidates:
                    if (userToReceive) {
                        sendToConnection(userToReceive.conn, {
                            type: Types.IceCandidates, username: data.username, data: data.data
                        })
                    }
                    break
                case Types.EndCall:
                    if (userToReceive) {
                        sendToConnection(userToReceive.conn, {
                            type: Types.EndCall, username: data.username
                        })
                    }
                    break
            }
        } catch (e) {
            console.log(e.message)
        }

    });
    connection.on('close', () => {
        console.log(`WebSocket connection closed from: ${req.remoteAddress}`);
        users.forEach(user => {
            if (user.conn === connection) {
                console.log(`User ${user.username} disconnected`);
                users.splice(users.indexOf(user), 1)
            }
        })
    })
});


const sendToConnection = (connection, message) => {
    connection.send(JSON.stringify(message))
}

const findUser = username => {
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username) return users[i]
    }
}
