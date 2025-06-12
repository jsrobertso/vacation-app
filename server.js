const express = require('express');
const cors = require('cors');

const api = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Root route with API overview
app.get('/', (req, res) => {
  res.json({
    message: 'Vacation Request Management API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      test: '/api/test',
      employees: '/api/employees',
      vacationRequests: '/api/vacation-requests',
      locations: '/api/locations',
      denialReasons: '/api/denial-reasons',
      dashboardStats: '/api/dashboard/stats',
      dashboardActivity: '/api/dashboard/activity'
    },
    frontend: 'http://localhost:3000'
  });
});

// Mount API routes
app.use('/api', api);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', database: 'In-Memory', timestamp: new Date().toISOString() });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api/test`);
  });
}

module.exports = app;
