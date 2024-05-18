// src/App.js

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (status) => {
    setIsLoggedIn(status);
  };

  return (
    <React.Fragment>
      {isLoggedIn ? (
        <Navbar onLogout={() => setIsLoggedIn(false)} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </React.Fragment>
  );
}

export default App;
