import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import MainApp from './components/MainApp';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  console.log('🚀 App component rendering, isLoggedIn:', isLoggedIn, 'username:', username);

  const handleLogin = (user) => {
    setUsername(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUsername('');
    setIsLoggedIn(false);
  };

  return (
    <ErrorBoundary>
      <div className="App">
        {!isLoggedIn ? (
          <Login onLogin={handleLogin} />
        ) : (
          <MainApp username={username} onLogout={handleLogout} />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
