const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();

// Serve static files from build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Create self-signed certificate for local HTTPS
const options = {
  key: fs.readFileSync('localhost-key.pem'),
  cert: fs.readFileSync('localhost.pem')
};

const PORT = 3001;

https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS server running on https://localhost:${PORT}`);
  console.log('Note: You may need to accept the self-signed certificate in your browser');
});
