import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Delete from './Delete';

function Output({ triggerRefetch }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, [triggerRefetch]);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/get-data');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = (deletedTimestamp) => {
    setData(prevData => prevData.filter(entry => entry.timestamp !== deletedTimestamp));
  };

  return (
    <div className="Output">
      <h2>Saved URLs</h2>
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
                <a href={`http://localhost:3001/invoice/${entry.inputs[0].data}`} target="_blank" rel="noopener noreferrer">
                  {`http://localhost:3001/invoice/${entry.inputs[0].data}`}
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
    </div>
  );
}

export default Output;
