import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');

  axios.defaults.withCredentials = true;  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:3300/Home');  
        setAuth(true);
        setName(res.data.name);  
      } catch (error) {
        console.log('Fetch error:', error.response || error.message);
        setAuth(false);
        setMessage(error.response?.data || 'Error occurred');
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3300/logout');  // Call the logout route
      setAuth(false);  // Update auth state
      setName('');     // Clear the name
      setMessage('Successfully logged out');  // Set message
      navigate('/');   // Redirect to the login page or home
    } catch (error) {
      console.log('Logout error:', error.response || error.message);
      setMessage('Error logging out');
    }
  };
  
  return (
    <div className='container'>
      {auth ? (
        <div>
          <h2>You Are Authorized, {name}!</h2>
          <button onClick={handleLogout}>Logout</button>  
        </div>
      ) : (
        <div>
          <h2>{message}</h2>
          <h2>Login Now</h2>
          <button><Link to={'/'}>Login</Link></button>
        </div>
      )}
    </div>
  );
}

export default Home;
