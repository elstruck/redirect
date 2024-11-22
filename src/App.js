import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Home from './Home';
import WhoopsPage from './WhoopsPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Redirect />} />
        <Route path="/k" element={<ProtectedRoute />} />
        {/* Route that captures any nested URL */}
        <Route path="/*" element={<RedirectPage />} />
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

// ProtectedRoute component (unchanged)
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

function RedirectPage() {
  const { '*': localUrl } = useParams(); // Capture nested URL
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!localUrl) {
      setError('No URL provided');
      return;
    }

    console.log('Attempting to fetch for URL:', localUrl);

    fetch(`http://localhost:3001/${encodeURIComponent(localUrl)}`)
      .then(async response => {
        const data = await response.json();
        console.log('Server response:', data);

        if (!response.ok) {
          throw new Error(data.error || 'Failed to get redirect URL');
        }

        if (data.redirectUrl) {
          window.location.replace(data.redirectUrl);
        } else {
          throw new Error('No redirect URL provided');
        }
      })
      .catch(err => {
        console.error('Error:', err);
        setError(err.message);
      });
  }, [localUrl]);

  if (error) {
    console.log('Rendering WhoopsPage with error:', error);
    return <WhoopsPage error={error} />;
  }

  return (
    <div className="App">
      <h1>Redirecting...</h1>
    </div>
  );
}


export default App;
