import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;  // This enables sending cookies with requests

  const handleChange = (e) => {
    setUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
   await axios.post('http://localhost:3300/', user, { withCredentials: true });
      alert('Logged in successful!');
      navigate('/Home');
    } catch (error) {
      console.log('Error:', error);
      alert('Log in failed. Please try again.');
    }
  };

  return (
    <div className='container'>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className='inputs'>
          <label>Email: </label>
          <input 
            type="email"
            placeholder='Enter your email'
            name='email'
            onChange={handleChange}
            value={user.email}
          />
        </div>
        <br />
        <div className='inputs'>
          <label>Password: </label>
          <input
            type="password"
            placeholder='Enter your password'
            name='password'
            onChange={handleChange}
            value={user.password}
          />
        </div>
        <div>
          <button>Login</button>
          <p>Don't Have an Account Yet? <Link to={'/Register'}>Register Here.</Link></p>
        </div>
      </form>
    </div>
  );
}

export default Login;
