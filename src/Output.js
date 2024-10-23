import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Delete from './Delete';
import Update from './Update';

function Output({ triggerRefetch }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

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

  const handleEditClick = (timestamp) => {
    setEditingId(prevEditingId => prevEditingId === timestamp ? null : timestamp);
  };

  const handleInputChange = (timestamp, index, value) => {
    setData(prevData => {
      const updatedData = [...prevData];
      const entry = updatedData.find(entry => entry.timestamp === timestamp);
      if (entry) {
        entry.inputs[index].data = value;
      }
      return updatedData;
    });
  };

  const handleUpdate = async (timestamp) => {
    try {
      await fetchData(); // Refresh data after update
    } catch (error) {
      console.error('Error updating data:', error);
    }
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
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry) => (
              <tr key={entry.timestamp}>
                <td>{new Date(entry.timestamp).toLocaleString()}</td>
                <td>
                  <a href={`${entry.inputs[0].data}`} target="_blank" rel="noopener noreferrer">
                    {`/${entry.inputs[0].data}`}
                  </a>
                </td>
                <td>
                  {editingId === entry.timestamp ? (
                    <div className="urlredirect-one">
                      <input
                        type="text"
                        value={entry.inputs[1].data}
                        onChange={(e) => handleInputChange(entry.timestamp, 1, e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="urlredirect-one">
                      {entry.inputs[1].data}
                    </div>
                  )}
                  <div className="urlredirect-two">
                    <button 
                      className={`edit edit-button ${editingId === entry.timestamp ? 'active' : ''}`}
                      onClick={() => handleEditClick(entry.timestamp)}
                    >
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                  </div>
                </td>
                <td>
                  <Update
                    timestamp={entry.timestamp}
                    localUrl={entry.inputs[0].data}
                    redirectUrl={entry.inputs[1].data}
                    onUpdate={handleUpdate}
                  />
                </td>
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
