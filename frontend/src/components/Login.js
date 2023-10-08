import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import $ from 'jquery'; 

function Login() {
  //navigate to home page after login
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  //message after logging
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Async function for submission handling
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    // Making an API call to php backend
    try {
      const response = await $.ajax({
        url: 'http://localhost:8000/user/login', 
        method: 'POST',
        dataType: 'json',
        data: formData, 
      });

      if (response === 'success') {
        setMessage('Login successful');
        navigate('/home'); // Redirect to the Home component
      } else if (response === 'wrongPassword' || response === 'noEmail'){
        setMessage('Invalid login credentials');
      }
    } catch (error) {
      console.error('API Error:', error);
      if(error.status === 401)
      {
        setMessage('Invalid login credentials');
      }else{
      setMessage('An error occurred during login');
      }

    }
  };

  return (
    <div className="container">
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
      {message && <div className={message.includes('successful') ? 'success' : 'error'}>{message}</div>}
    </div>
  );
}

export default Login;

