import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    try {
      const response = await axios.post('/api/login', { username, password });
      console.log('Login response:', response.data); // Log the response
      if (response.data.success) {
        onLogin();
      } else {
        setError('Login failed: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      setError('Login failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="Login">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
