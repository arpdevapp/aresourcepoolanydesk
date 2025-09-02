# Deploy WebSocket Server to Render

## Steps to Deploy:

1. **Create a Render Account**
   - Go to https://render.com
   - Sign up for a free account

2. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure the Service**
   - **Name**: `aresourcepool-websocket-server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` (for testing)

4. **Environment Variables** (if needed)
   - No special environment variables required for basic setup

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your server will be available at: `https://aresourcepool-websocket-server.onrender.com`

## Update Web Client

After deployment, update the web client to use the new server URL:

```javascript
// In web-client/src/services/socketService.js
const getSocketUrl = () => {
  if (window.location.protocol === 'https:') {
    return 'wss://aresourcepool-websocket-server.onrender.com';
  }
  return 'ws://localhost:3000';
};
```

## Test the Connection

1. Deploy the server to Render
2. Update and redeploy the web client
3. Test the connection from both web and Android clients
