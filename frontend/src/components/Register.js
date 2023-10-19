import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';

function Register() {
  const navigate = useNavigate(); // Define the navigate function
  const [formData, setFormData] = useState({
    name: '',
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
        url: 'http://localhost:8000/user/register',
        method: 'POST',
        dataType: 'json',
        data: formData,
      });

      if (response.status === 200) {
        setMessage('Registration successful');
        navigate('/login');
      } else {
        setMessage('Registration failed');
      }
    } catch (error) {
      console.error('API Error:', error);
      if (error.status === 400) {
        setMessage('Invalid registration data');
      } else {
        setMessage('An error occurred during registration');
      }
    }
  };
  return (
    <div className="mainBody">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
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
        <button type="submit">Register</button>
      </form>
      {message && (
        <div className={message.includes('successful') ? 'success' : 'error'}>
          {message}
        </div>
      )}
    </div>
  );
}

export default Register;
