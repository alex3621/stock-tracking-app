import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Manage from './components/Manage'
import './App.css';

function App() {
  const storedEmail = localStorage.getItem('userEmail');
  const [userEmail, setUserEmail] = useState(storedEmail || '');
  const [isLoggedIn, setIsLoggedIn] = useState(!!storedEmail);

  const handleLogin = (email) => {
    setUserEmail(email);
    setIsLoggedIn(true);
    localStorage.setItem('userEmail', email);
  };

  const handleLogout = () => {
    setUserEmail('');
    setIsLoggedIn(false);
    localStorage.removeItem('userEmail');
  };

  return (
    <Router>
<nav className="custom-navbar">
  <ul className="custom-navbar-list">
    {!isLoggedIn ? (
      <>
        <li className="custom-navbar-item">
          <Link to="/login" className="custom-navbar-link">Login</Link>
        </li>
        <li className="custom-navbar-item">
          <Link to="/register" className="custom-navbar-link">Register</Link>
        </li>
      </>
    ) : null}
    {isLoggedIn && (
      <>
        <li className="custom-navbar-item">
          <Link to="/home" className="custom-navbar-link">Home</Link>
        </li> 
        <li className="custom-navbar-item">
          <Link to="/manage" className="custom-navbar-link">Manage</Link>
        </li>
        <li className="custom-navbar-item">
          <Link to="/" onClick={handleLogout} className="custom-navbar-link">Logout</Link>
        </li>
        <li className="custom-navbar-item custom-navbar-link">
      {userEmail}
    </li>
      </>
    )}
  </ul>
</nav>



      <Routes>
        <Route path="/" element={<Login handleLogin={handleLogin} />} />
        <Route path="/login" element={<Login handleLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/manage" element={<Manage userEmail={userEmail} />} />
      </Routes>
    </Router>
  );
}

export default App;
