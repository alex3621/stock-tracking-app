import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Manage from './components/Manage'
import Funds from './components/Funds';
import Sell from './components/Sell';
import AddFunds from './components/AddFunds';
import './App.css';

function App() {
  const storedUserId = localStorage.getItem('userId');
  const storedEmail = localStorage.getItem('userEmail');
  const [userId, setUserId] = useState(storedUserId || '');
  const [userEmail, setUserEmail] = useState(storedEmail || '');
  const [isLoggedIn, setIsLoggedIn] = useState(!!storedEmail);

  const handleLogin = (id, email) => {
    setUserId(id);
    setUserEmail(email);
    setIsLoggedIn(true);
    localStorage.setItem('userId', id);
    localStorage.setItem('userEmail', email);
  };

  const handleLogout = () => {
    setUserId('');
    setUserEmail('');
    setIsLoggedIn(false);
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
  };

  return (
    <Router>
      <div className="custom-navbar">
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
                <Link to="/sell" className="custom-navbar-link">Sell</Link>
              </li>
              <li className="custom-navbar-item">
                <Link to="/AddFunds" className="custom-navbar-link">Add Funds</Link>
              </li>
              <li className="custom-navbar-item custom-navbar-link">
                <Funds userId={userId} />
              </li>
              <div className="custom-navbar-right">
                <li className="custom-navbar-item custom-navbar-link">
                  {userEmail}
                </li>
                <li className="custom-navbar-item">
                  <Link to="/" onClick={handleLogout} className="custom-navbar-link">Logout</Link>
                </li>
              </div>
            </>
          )}
        </ul>
      </div>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />


      <Routes>
        <Route path="/" element={<Login handleLogin={handleLogin} />} />
        <Route path="/login" element={<Login handleLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Home" element={<Home userId={userId}/>} />
        <Route path="/manage" element={<Manage userId={userId} />} />
        <Route path="/sell" element={<Sell userId={userId} />} />
        <Route path="/AddFunds" element={<AddFunds userId={userId} />} />
      </Routes>
    </Router>
  );
}

export default App;
