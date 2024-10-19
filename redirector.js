const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Simulated database of valid credentials
const validCredentials = [
  { username: 'admin', secret: 'secretkey123' },
  { username: 'user1', secret: 'userkey456' }
];

// Simple authentication middleware
const authenticate = (req, res, next) => {
  const { username, secret } = req.body;

  const isValid = validCredentials.some(
    cred => cred.username === username && cred.secret === secret
  );

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  next();
};

// Serve the React app for the /k route
app.get('/k', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// API endpoint to get data
app.get('/api/get-data', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'data.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({ error: 'Error reading data' });
  }
});

// API endpoint to save data
app.post('/api/save-data', async (req, res) => {
  try {
    const { data } = req.body;
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Invalid data format' });
    }
    const filePath = path.join(__dirname, 'data.json');

    let existingData = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      existingData = JSON.parse(fileContent);
    } catch (error) {
      // If file doesn't exist or is empty, we'll start with an empty array
    }

    const localUrl = data[0].data;
    const existingIndex = existingData.findIndex(entry => entry.inputs[0].data === localUrl);

    if (existingIndex !== -1) {
      // Update existing entry
      existingData[existingIndex] = {
        timestamp: new Date().toISOString(),
        inputs: data
      };
    } else {
      // Add new entry
      existingData.push({
        timestamp: new Date().toISOString(),
        inputs: data
      });
    }

    await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));

    res.status(200).json(existingData);
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Error saving data' });
  }
});

// New API endpoint to save data externally with simple authentication
app.post('/api/external-save', authenticate, async (req, res) => {
  try {
    const { urlLocal, urlRedirect } = req.body;
    
    if (!urlLocal || !urlRedirect) {
      return res.status(400).json({ error: 'Both urlLocal and urlRedirect are required' });
    }

    const filePath = path.join(__dirname, 'data.json');

    let existingData = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      existingData = JSON.parse(fileContent);
    } catch (error) {
      // If file doesn't exist or is empty, we'll start with an empty array
    }

    // Check if urlLocal already exists
    const urlExists = existingData.some(entry => entry.inputs[0].data === urlLocal);
    if (urlExists) {
      return res.status(400).json({ error: 'URL local already exists' });
    }

    const newEntry = {
      timestamp: new Date().toISOString(),
      inputs: [
        { label: 'URL local', data: urlLocal },
        { label: 'URL redirect', data: urlRedirect }
      ]
    };

    existingData.push(newEntry);

    await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));

    res.status(200).json({ message: 'Data saved successfully', entry: newEntry });
  } catch (error) {
    console.error('Error saving external data:', error);
    res.status(500).json({ error: 'Error saving data' });
  }
});

// New API endpoint to delete data
app.delete('/api/delete-data/:timestamp', async (req, res) => {
  try {
    const { timestamp } = req.params;
    const filePath = path.join(__dirname, 'data.json');

    let existingData = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      existingData = JSON.parse(fileContent);
    } catch (error) {
      return res.status(404).json({ error: 'Data file not found' });
    }

    const updatedData = existingData.filter(entry => entry.timestamp !== timestamp);

    if (updatedData.length === existingData.length) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    await fs.writeFile(filePath, JSON.stringify(updatedData, null, 2));

    res.status(200).json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'Error deleting data' });
  }
});

// New API endpoint to delete data
app.delete('/api/delete-data/:timestamp', async (req, res) => {
  try {
    const { timestamp } = req.params;
    const filePath = path.join(__dirname, 'data.json');

    let existingData = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      existingData = JSON.parse(fileContent);
    } catch (error) {
      return res.status(404).json({ error: 'Data file not found' });
    }

    const updatedData = existingData.filter(entry => entry.timestamp !== timestamp);

    if (updatedData.length === existingData.length) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    await fs.writeFile(filePath, JSON.stringify(updatedData, null, 2));

    res.status(200).json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'Error deleting data' });
  }
});

// New route for URL redirection
app.get('/:localUrl', async (req, res) => {
  try {
    const { localUrl } = req.params;
    console.log(`Received redirection request for: ${localUrl}`);

    const filePath = path.join(__dirname, 'data.json');
    console.log(`Attempting to read data from: ${filePath}`);

    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    console.log(`Successfully read data. Found ${data.length} entries.`);

    // Find the matching entry
    const matchingEntry = data.find(entry => entry.inputs[0].data === localUrl);

    if (matchingEntry) {
      console.log(`Match found. Redirecting to: ${matchingEntry.inputs[1].data}`);
      // Redirect to the corresponding URL
      return res.redirect(matchingEntry.inputs[1].data);
    } else {
      console.log(`No match found for: ${localUrl}`);
      // If no match is found, send a 404 response
      return res.status(404).send('No matching URL found');
    }
  } catch (error) {
    console.error('Error processing redirection:', error);
    return res.status(500).send(`Error processing redirection: ${error.message}`);
  }
});

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all route to serve the React app for any unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
