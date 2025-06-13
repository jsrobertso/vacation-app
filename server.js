const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const api = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'in-memory-secret';

const demoUser = {
  id: 1,
  first_name: 'Demo',
  last_name: 'User',
  email: 'demo@company.com',
  password: 'password',
  role: 'administrator',
  location_id: 1
};

app.use(cors());
app.use(express.json());

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (email === demoUser.email && password === demoUser.password) {
    const token = jwt.sign(
      { id: demoUser.id, role: demoUser.role, location_id: demoUser.location_id },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    return res.json({
      token,
      user: {
        id: demoUser.id,
        first_name: demoUser.first_name,
        last_name: demoUser.last_name,
        email: demoUser.email,
        role: demoUser.role,
        location_id: demoUser.location_id
      }
    });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

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
