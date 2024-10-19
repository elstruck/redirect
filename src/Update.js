import React from 'react';
import axios from 'axios';

function Update({ timestamp, localUrl, redirectUrl, onUpdate }) {
  const handleUpdate = async () => {
    try {
      await axios.post('/api/save-data', {
        data: [
          { label: 'URL local', data: localUrl },
          { label: 'URL redirect', data: redirectUrl }
        ]
      });
      onUpdate(timestamp);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  return (
    <button onClick={handleUpdate} className="success">Update</button>
  );
}

export default Update;
