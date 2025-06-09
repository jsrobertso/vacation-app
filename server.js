const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Simple in-memory data store for demo
let employees = [
  { id: 1, name: 'John Doe', email: 'john@company.com', department: 'Engineering', location: 'New York' },
  { id: 2, name: 'Jane Smith', email: 'jane@company.com', department: 'Marketing', location: 'Los Angeles' }
];

let vacationRequests = [
  {
    id: 1,
    employeeId: 1,
    employeeName: 'John Doe',
    startDate: '2024-01-15',
    endDate: '2024-01-19',
    reason: 'Family vacation',
    status: 'pending',
    submittedDate: '2024-01-01'
  }
];

let locations = [
  { id: 1, name: 'New York', timezone: 'EST' },
  { id: 2, name: 'Los Angeles', timezone: 'PST' }
];

let denialReasons = [
  { id: 1, reason: 'Insufficient vacation balance' },
  { id: 2, reason: 'Scheduling conflict' },
  { id: 3, reason: 'Blackout period' }
];

// Root route
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

// API Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Vacation API is running!' });
});

// Employee routes
app.get('/api/employees', (req, res) => {
  res.json(employees);
});

app.post('/api/employees', (req, res) => {
  const employee = { id: Date.now(), ...req.body };
  employees.push(employee);
  res.json(employee);
});

// Vacation request routes
app.get('/api/vacation-requests', (req, res) => {
  res.json(vacationRequests);
});

app.post('/api/vacation-requests', (req, res) => {
  const request = { id: Date.now(), ...req.body, submittedDate: new Date().toISOString().split('T')[0] };
  vacationRequests.push(request);
  res.json(request);
});

app.put('/api/vacation-requests/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = vacationRequests.findIndex(req => req.id === id);
  if (index !== -1) {
    vacationRequests[index] = { ...vacationRequests[index], ...req.body };
    res.json(vacationRequests[index]);
  } else {
    res.status(404).json({ error: 'Request not found' });
  }
});

// Location routes
app.get('/api/locations', (req, res) => {
  res.json(locations);
});

// Denial reason routes
app.get('/api/denial-reasons', (req, res) => {
  res.json(denialReasons);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: 'In-Memory',
    timestamp: new Date().toISOString()
  });
});

// Dashboard stats endpoint
app.get('/api/dashboard/stats', (req, res) => {
  const stats = {
    connections: {
      frontend: {
        host: 'localhost',
        port: '3000',
        url: 'http://localhost:3000',
        protocol: 'HTTP'
      },
      backend: {
        host: 'localhost',
        port: '3001',
        url: 'http://localhost:3001',
        status: 'healthy'
      },
      database: {
        host: 'localhost',
        port: 'N/A',
        database: 'in-memory',
        status: 'connected',
        connectionString: 'In-Memory Storage'
      }
    },
    employees: {
      total: employees.length,
      supervisors: employees.filter(emp => emp.department === 'Engineering').length
    },
    locations: {
      total: locations.length
    },
    vacationRequests: {
      total: vacationRequests.length,
      pending: vacationRequests.filter(req => req.status === 'pending').length,
      approved: vacationRequests.filter(req => req.status === 'approved').length,
      denied: vacationRequests.filter(req => req.status === 'denied').length,
      recent: vacationRequests.slice(-5).map(req => ({
        employee: req.employeeName,
        start_date: req.startDate,
        days: Math.ceil((new Date(req.endDate) - new Date(req.startDate)) / (1000 * 60 * 60 * 24)) + 1,
        status: req.status,
        created: req.submittedDate
      }))
    },
    denialReasons: {
      active: denialReasons.length
    },
    system: {
      nodeVersion: process.version,
      uptime: process.uptime(),
      memory: process.memoryUsage()
    }
  };
  
  res.json(stats);
});

// Dashboard activity endpoint
app.get('/api/dashboard/activity', (req, res) => {
  const employeeCounts = {};
  
  vacationRequests.forEach(req => {
    if (!employeeCounts[req.employeeName]) {
      employeeCounts[req.employeeName] = { requests: 0, totalDays: 0 };
    }
    employeeCounts[req.employeeName].requests++;
    const days = Math.ceil((new Date(req.endDate) - new Date(req.startDate)) / (1000 * 60 * 60 * 24)) + 1;
    employeeCounts[req.employeeName].totalDays += days;
  });
  
  const topRequesters = Object.entries(employeeCounts)
    .map(([employee, data]) => ({ employee, ...data }))
    .sort((a, b) => b.requests - a.requests)
    .slice(0, 5);
  
  res.json({
    topRequesters
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/test`);
});