import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';

function Register() {
  const navigate = useNavigate();
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
    <div className="auth-wrapper">
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Register</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">Register</button>
                </div>
              </form>
              {message && (
                <div className={`alert mt-3 ${message.includes('successful') ? 'alert-success' : 'alert-danger'}`} role="alert">
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Register;