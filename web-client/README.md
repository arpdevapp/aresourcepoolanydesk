# Screen Share Web App

A modern React web application for real-time screen sharing using WebRTC and WebSocket technology.

## 🚀 Features

- **Real-time Screen Sharing**: Share your screen with other users instantly
- **WebRTC Technology**: High-quality, low-latency video streaming
- **Modern UI/UX**: Beautiful, responsive design with glassmorphism effects
- **Cross-platform**: Works on any modern web browser
- **Real-time Communication**: Instant connection requests and notifications

## 🛠️ Tech Stack

- **Frontend**: React 18, CSS3 with modern features
- **WebRTC**: Real-time peer-to-peer communication
- **WebSocket**: Real-time bidirectional communication
- **Styling**: Modern CSS with gradients, backdrop-filter, and animations

## 📱 How It Works

1. **Login**: Enter your username to join the app
2. **Connect**: Enter the target username you want to share with
3. **Share**: Click "Start Screen Share" to begin sharing your screen
4. **Accept/Decline**: Receive and respond to connection requests
5. **Real-time**: View both local and remote screens simultaneously

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Modern web browser with WebRTC support

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd web-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The build files will be created in the `build` folder.

## 🌐 Deployment

### GitHub Pages

1. **Add homepage to package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/your-repo-name"
   }
   ```

2. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Add deploy scripts to package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

4. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

### Other Platforms

- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect your GitHub repository
- **Firebase**: Use Firebase Hosting

## 🔧 Configuration

### WebSocket Server

Update the WebSocket URL in `src/services/socketService.js`:

```javascript
const SOCKET_URL = 'ws://your-server-ip:3000';
```

### STUN Servers

Modify STUN servers in `src/hooks/useWebRTC.js`:

```javascript
const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};
```

## 📁 Project Structure

```
web-client/
├── public/
├── src/
│   ├── components/
│   │   ├── Login.js          # Login component
│   │   ├── Login.css         # Login styles
│   │   ├── MainApp.js        # Main application
│   │   └── MainApp.css       # Main app styles
│   ├── hooks/
│   │   └── useWebRTC.js      # WebRTC logic hook
│   ├── services/
│   │   └── socketService.js  # WebSocket service
│   ├── App.js                # Main app component
│   ├── App.css               # Main app styles
│   └── index.js              # Entry point
├── package.json
└── README.md
```

## 🎨 Customization

### Colors and Themes

Modify the CSS variables in the component files to change the color scheme:

```css
/* Example: Change primary gradient */
background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
```

### Styling

The app uses modern CSS features:
- **Backdrop-filter**: Glassmorphism effects
- **CSS Grid**: Responsive layouts
- **CSS Variables**: Easy theming
- **Animations**: Smooth transitions and hover effects

## 🔒 Security Considerations

- **HTTPS Required**: WebRTC requires secure context in production
- **User Validation**: Implement proper user authentication
- **Rate Limiting**: Add rate limiting to prevent abuse
- **Input Sanitization**: Validate all user inputs

## 🐛 Troubleshooting

### Common Issues

1. **Screen Share Not Working**
   - Ensure you're using HTTPS in production
   - Check browser permissions for screen sharing
   - Verify WebRTC support in your browser

2. **Connection Issues**
   - Check WebSocket server status
   - Verify network connectivity
   - Check browser console for errors

3. **Video Not Displaying**
   - Ensure video elements have proper dimensions
   - Check if streams are properly attached
   - Verify WebRTC connection state

### Browser Support

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support (iOS 11+)
- **Edge**: Full support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- WebRTC API for real-time communication
- React team for the amazing framework
- Modern CSS features for beautiful design

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the WebRTC documentation

---

**Happy Screen Sharing! 🎥✨**
