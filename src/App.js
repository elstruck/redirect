import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Redirect />} />
        <Route path="/k" element={<ProtectedRoute />} />
      </Routes>
    </Router>
  );
}

// Redirect component
function Redirect() {
  React.useEffect(() => {
    window.location.href = 'https://kepsakekreations.com';
  }, []);

  return null;
}

// ProtectedRoute component
function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const correctPassword = 'KEPsake!01'; // Replace with your desired password

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  if (isAuthenticated) {
    return <Home />;
  }

  return (
    <div className="App">
      <div>
        <h2>Enter Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
        />
        <button className="edit" type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default App;
