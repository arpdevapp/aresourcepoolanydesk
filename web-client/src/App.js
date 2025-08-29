import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import MainApp from './components/MainApp';

function App() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (user) => {
    setUsername(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUsername('');
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <MainApp username={username} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
