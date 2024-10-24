import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


function Register() {
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  function handleChange(e) {
    setUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3300/Register', user);
      alert('Registration successful!');
      navigate('/');
    } catch (error) {
      console.log(error);
      alert('Registration failed. Please try again.');
    }
  }

  return (
    <div className='register'>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="inputs">
          <label>First Name:</label>
          <input
            type="text"
            placeholder='Enter first name'
            name='first_name'
            onChange={handleChange}
            value={user.first_name}
          />
        </div>

        <div className="inputs">
          <label>Last Name:</label>
          <input
            type="text"
            placeholder='Enter last name'
            name='last_name'
            onChange={handleChange}
            value={user.last_name}
          />
        </div>

        <div className="inputs">
          <label>Phone Number:</label>
          <input
            type="number"
            placeholder='Mobile Number'
            name='phone_number'
            onChange={handleChange}
            value={user.phone_number}
          />
        </div>

        <div className="inputs">
          <label>Email:</label>
          <input
            type="email"
            placeholder='Enter Email'
            name='email'
            onChange={handleChange}
            value={user.email}
          />
        </div>

        <div className="inputs">
          <label>Password:</label>
          <input
            type="password"
            placeholder='Enter Password'
            name='password'
            onChange={handleChange}
            value={user.password}
          />
        </div>

        <button type='submit'>Register</button>
      </form>

      <p>Already have an account? <Link to={'/'}>Login Here!</Link></p>
    </div>
  );
}

export default Register;
