import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';

function Login({ handleLogin }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await $.ajax({
        url: 'http://localhost:8000/user/login',
        method: 'POST',
        dataType: 'json',
        data: formData,
      });

      if (response === 'success') {
        setMessage('Login successful');
        handleLogin(); // Call the handleLogin function from props
        navigate('/home');
      } else if (response === 'wrongPassword' || response === 'noEmail') {
        setMessage('Invalid login credentials');
      }
    } catch (error) {
      console.error('API Error:', error);
      if (error.status === 401) {
        setMessage('Invalid login credentials');
      } else {
        setMessage('An error occurred during login');
      }
    }
  };

  return (
    <div className="mainBody">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && (
        <div className={message.includes('successful') ? 'success' : 'error'}>
          {message}
        </div>
      )}
    </div>
  );
}

export default Login;
