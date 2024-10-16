import React from 'react';
import axios from 'axios';

function Delete({ timestamp, onDelete }) {
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/delete-data/${timestamp}`);
      onDelete(timestamp);
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  return (
    <button onClick={handleDelete}>Delete</button>
  );
}

export default Delete;

