const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Simple test endpoints
app.get('/', (req, res) => {
  res.json({ 
    message: 'Simple Test Server Running!',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', server: 'test-simple' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API test endpoint working!' });
});

app.listen(PORT, () => {
  console.log(`🧪 Simple test server running on http://localhost:${PORT}`);
});