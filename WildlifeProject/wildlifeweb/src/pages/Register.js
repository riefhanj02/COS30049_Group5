import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Register.css';
import backgroundImage from '../assets/background.jpg';
import { useNavigate } from 'react-router-dom'; 


const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    birthday: '',
    password: '',
    confirm_password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { first_name, last_name, email, gender, birthday, password, confirm_password } = formData;

    if (!first_name || !last_name || !email || !gender || !birthday || !password || !confirm_password) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:3000/userprofile', {
        first_name,
        last_name,
        email,
        gender,
        birthday,
        confirmed_password: password,
      });

      if (response.status === 201) {
        setSuccess('Registration successful! You can now log in.');
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          gender: '',
          birthday: '',
          password: '',
          confirm_password: '',
        });
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Error registering user:', err);
      setError('An error occurred while registering. Please try again.');
    }
  };

  return (
    <div
      className="register-background"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="register-container">
        <h2>Create an Account</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Enter your first name"
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Enter your last name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="form-group">
            <label>Birthday</label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
          </div>

          <button type="submit" className="register-button">Register</button>
          <button className="register-button" onClick={() => navigate('/Profile')}>
              Login Page
            </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
