# 🚀 Screen Share App - Deployment Guide

This guide will help you deploy both the Android app and the React web client to production.

## 📱 Android App Deployment

### 1. Build Release APK

```bash
cd app
./gradlew assembleRelease
```

The release APK will be created at: `app/build/outputs/apk/release/app-release.apk`

### 2. Sign the APK (Required for Play Store)

1. **Generate Keystore** (if you don't have one):
   ```bash
   keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure signing in `app/build.gradle.kts`**:
   ```kotlin
   android {
       signingConfigs {
           create("release") {
               storeFile = file("my-release-key.keystore")
               storePassword = "your-store-password"
               keyAlias = "my-key-alias"
               keyPassword = "your-key-password"
           }
       }
       
       buildTypes {
           release {
               isMinifyEnabled = true
               proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
               signingConfig = signingConfigs.getByName("release")
           }
       }
   }
   ```

3. **Build signed APK**:
   ```bash
   ./gradlew assembleRelease
   ```

### 3. Google Play Store Deployment

1. **Create Developer Account** at [Google Play Console](https://play.google.com/console)
2. **Upload APK** to Play Console
3. **Fill Store Listing** (description, screenshots, etc.)
4. **Submit for Review**

## 🌐 Web Client Deployment

### Option 1: GitHub Pages (Free)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Select source: "Deploy from a branch"
   - Select branch: `gh-pages`
   - Save

3. **Deploy**:
   ```bash
   cd web-client
   npm run deploy
   ```

Your app will be available at: `https://yourusername.github.io/your-repo-name`

### Option 2: Netlify (Free)

1. **Build the app**:
   ```bash
   cd web-client
   npm run build
   ```

2. **Deploy to Netlify**:
   - Go to [Netlify](https://netlify.com)
   - Drag and drop the `build` folder
   - Or connect your GitHub repository for auto-deployment

### Option 3: Vercel (Free)

1. **Connect GitHub repository** to [Vercel](https://vercel.com)
2. **Auto-deployment** on every push to main branch
3. **Custom domain** support included

### Option 4: Firebase Hosting

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase**:
   ```bash
   cd web-client
   firebase init hosting
   ```

3. **Deploy**:
   ```bash
   firebase deploy
   ```

## 🖥️ Server Deployment

### Option 1: Heroku (Free Tier Discontinued)

1. **Create Heroku account**
2. **Install Heroku CLI**:
   ```bash
   npm install -g heroku
   ```

3. **Deploy**:
   ```bash
   cd Server
   heroku create your-app-name
   git push heroku main
   ```

### Option 2: Railway (Free)

1. **Connect GitHub repository** to [Railway](https://railway.app)
2. **Auto-deployment** on push
3. **Custom domain** support

### Option 3: Render (Free)

1. **Create account** at [Render](https://render.com)
2. **New Web Service** from GitHub repository
3. **Auto-deployment** configured

### Option 4: DigitalOcean App Platform

1. **Create account** at [DigitalOcean](https://digitalocean.com)
2. **App Platform** → Create App
3. **Connect GitHub repository**
4. **Auto-deployment** with custom domain

## 🔧 Environment Configuration

### Web Client

Update WebSocket URL in `web-client/src/services/socketService.js`:

```javascript
// Development
const SOCKET_URL = 'ws://localhost:3000';

// Production (replace with your server URL)
const SOCKET_URL = 'wss://your-server-domain.com';
```

### Server

Create `.env` file in Server directory:

```env
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-web-app-domain.com
```

## 🔒 HTTPS Requirements

**Important**: WebRTC requires HTTPS in production!

- **Web Client**: Most hosting platforms provide HTTPS automatically
- **Server**: Use reverse proxy (Nginx) with Let's Encrypt SSL
- **WebSocket**: Use `wss://` instead of `ws://` in production

## 📊 Monitoring & Analytics

### 1. **Error Tracking**
- [Sentry](https://sentry.io) - Free tier available
- [LogRocket](https://logrocket.com) - Session replay

### 2. **Performance Monitoring**
- [Web Vitals](https://web.dev/vitals/) - Built into React
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### 3. **User Analytics**
- [Google Analytics](https://analytics.google.com) - Free
- [Mixpanel](https://mixpanel.com) - Free tier available

## 🚨 Common Deployment Issues

### 1. **WebRTC Not Working**
- Ensure HTTPS is enabled
- Check browser console for errors
- Verify STUN server accessibility

### 2. **WebSocket Connection Failed**
- Check server status
- Verify firewall settings
- Ensure correct WebSocket URL

### 3. **Build Failures**
- Check Node.js version compatibility
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall

### 4. **Performance Issues**
- Enable gzip compression
- Use CDN for static assets
- Optimize images and bundle size

## 📱 Testing Deployment

### 1. **Local Testing**
```bash
# Test web client
cd web-client
npm start

# Test server
cd Server
npm start
```

### 2. **Production Testing**
- Test on different devices and browsers
- Verify WebRTC functionality
- Check WebSocket connectivity
- Test screen sharing permissions

## 🔄 Continuous Deployment

### GitHub Actions (Already Configured)

The project includes a GitHub Actions workflow that automatically:
- Builds the React app
- Runs tests
- Deploys to GitHub Pages
- Triggers on push to main branch

### Custom CI/CD

You can also set up:
- **GitLab CI/CD**
- **Jenkins**
- **CircleCI**
- **Travis CI**

## 📞 Support & Troubleshooting

1. **Check logs** in hosting platform dashboard
2. **Browser console** for client-side errors
3. **Server logs** for backend issues
4. **Network tab** for WebSocket/WebRTC issues

## 🎯 Next Steps

After successful deployment:

1. **Set up monitoring** and error tracking
2. **Configure analytics** to track usage
3. **Set up alerts** for downtime
4. **Plan scaling** strategy
5. **Document** deployment process for team

---

**Happy Deploying! 🚀✨**
