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

// RedirectPage component
function RedirectPage() {
  const { "*": localUrl } = useParams();  // Capture the entire nested URL (including slashes)
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the redirect URL for the nested localUrl
    fetch(`/${encodeURIComponent(localUrl)}`)  // Make sure to encode the URL
      .then(response => response.json())
      .then(data => {
        if (data.redirectUrl) {
          setRedirectUrl(data.redirectUrl);
          // Set a delay to give the user time to see the page before redirection
          setTimeout(() => {
            window.location.href = data.redirectUrl;
          }, 5000);  // 5-second delay before redirect
        } else {
          setError(data.error || 'No redirect URL found');
        }
      })
      .catch(err => {
        console.error('Error fetching redirect URL:', err);
        setError('An error occurred while fetching the redirect URL');
      });
  }, [localUrl]);

  if (error) {
    return <WhoopsPage error={error} />;  // Display error page if there's an issue
  }

  return (
    <div className="App">
      <h1>KEPsake Kreations</h1>  
      <p>
        You will be redirected shortly. If you are not redirected automatically,{' '}
        <a href={redirectUrl}>click here</a>.
      </p>
    </div>
  );
}

export default App;
