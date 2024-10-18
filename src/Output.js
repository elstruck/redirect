import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Delete from './Delete';

function Output({ triggerRefetch }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [triggerRefetch]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/get-data');
      console.log('API Response:', response.data); // Debug log
      if (Array.isArray(response.data)) {
        setData(response.data);
      } else if (typeof response.data === 'object' && response.data !== null) {
        // If the data is an object, try to find an array property
        const arrayData = Object.values(response.data).find(Array.isArray);
        if (arrayData) {
          setData(arrayData);
        } else {
          throw new Error('No array found in response data');
        }
      } else {
        throw new Error(`Unexpected data type: ${typeof response.data}`);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(`Failed to fetch data: ${error.message}`);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (deletedTimestamp) => {
    setData(prevData => prevData.filter(entry => entry.timestamp !== deletedTimestamp));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="Output">
      <h2>Saved URLs</h2>
      {data.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>URL local</th>
              <th>URL redirect</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={index}>
                <td>{new Date(entry.timestamp).toLocaleString()}</td>
                <td>
                  <a href={`${entry.inputs[1].data}`} target="_blank" rel="noopener noreferrer">
                    {`/${entry.inputs[0].data}`}
                  </a>
                </td>
                <td>{entry.inputs[1].data}</td>
                <td>
                  <Delete timestamp={entry.timestamp} onDelete={handleDelete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Output;
