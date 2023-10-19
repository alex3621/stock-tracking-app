import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
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
          <Link to="/" onClick={handleLogout} className="custom-navbar-link">Logout</Link>
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
      </Routes>
    </Router>
  );
}

export default App;
