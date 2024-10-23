import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const WhoopsPage = () => {
  const [error, setError] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState(null);
  const { localUrl } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/${localUrl}`);
        const data = await response.json();
        if (response.status === 404) {
          setError(data.error);
        } else {
          setError('An unexpected error occurred');
        }
      } catch (error) {
        setError('Failed to fetch data');
      }
    };

    fetchData();
  }, [localUrl]);

  useEffect(() => {
    const fetchRedirectUrl = async () => {
      try {
        const response = await fetch('/api/get-data');
        const data = await response.json();
        const matchingEntry = data.find(entry => entry.inputs[0].data === localUrl);
        if (matchingEntry) {
          setRedirectUrl(matchingEntry.inputs[1].data);
        }
      } catch (error) {
        console.error('Error fetching redirect URL:', error);
      }
    };

    fetchRedirectUrl();
  }, [localUrl]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Whoops!</h1>
      <p>{error || 'Something went wrong'}</p>
      {redirectUrl && (
        <p>
          Did you mean to go to:{' '}
          <a href={redirectUrl} target="_blank" rel="noopener noreferrer">
            {redirectUrl}
          </a>
        </p>
      )}
      <p>
        <a href="/">Go back to home</a>
      </p>
    </div>
  );
};

export default WhoopsPage;
