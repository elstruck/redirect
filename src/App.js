import React, { useState } from 'react';
import axios from 'axios';
import Output from './Output';
import './App.css';
function App() {
  const [inputData, setInputData] = useState({
    input1: { label: 'URL local', data: '' },
    input2: { label: 'URL redirect', data: '' }
  });
  const [triggerRefetch, setTriggerRefetch] = useState(0);

  const handleInputChange = (e, inputKey) => {
    setInputData(prevState => ({
      ...prevState,
      [inputKey]: { ...prevState[inputKey], data: e.target.value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/save-data', { data: Object.values(inputData) });
      setInputData({
        input1: { label: 'URL local', data: '' },
        input2: { label: 'URL redirect', data: '' }
      });
      setTriggerRefetch(prev => prev + 1); // Increment to trigger refetch
    } catch (error) {
      console.error('Error saving data:', error);
      // Optionally, you can set an error state here if you want to display an error message in the UI
    }
  };

  return (
    <div className="App">
      <h1>Save Redirects</h1>
      <form onSubmit={handleSubmit}>
        {Object.entries(inputData).map(([key, { label, data }]) => (
          <div key={key}>
            <label htmlFor={key}>{label}:</label>
            <input
              id={key}
              type="text"
              value={data}
              onChange={(e) => handleInputChange(e, key)}
              placeholder={`Enter ${label.toLowerCase()}`}
            />
          </div>
        ))}
        <button type="submit">Save</button>
      </form>
      <Output triggerRefetch={triggerRefetch} />
    </div>
  );
}

export default App;
