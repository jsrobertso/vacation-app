const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/database');

// Import models
const Employee = require('./models/Employee');
const Location = require('./models/Location');
const DenialReason = require('./models/DenialReason');
const VacationRequest = require('./models/VacationRequest');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Employee.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign(
      { id: user._id, role: user.role, location_id: user.location_id },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({
      token,
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        location_id: user.location_id
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Protect all following API routes
app.use('/api', authMiddleware);

// Employee Routes
app.get(
  '/api/employees',
  authorize('administrator', 'supervisor'),
  async (req, res) => {
    try {
      const query =
        req.user.role === 'supervisor'
          ? { location_id: req.user.location_id }
          : {};
      const employees = await Employee.find(query)
        .populate('location_id', 'name')
        .populate('supervisor_id', 'first_name last_name');
      res.json(employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      res.status(500).json({ error: 'Failed to fetch employees' });
    }
  }
);

app.post('/api/employees', authorize('administrator'), async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    await employee.populate('location_id', 'name');
    await employee.populate('supervisor_id', 'first_name last_name');
    res.status(201).json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(400).json({ error: 'Failed to create employee' });
  }
});

app.put('/api/employees/:id', authorize('administrator'), async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('location_id', 'name')
      .populate('supervisor_id', 'first_name last_name');
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(400).json({ error: 'Failed to update employee' });
  }
});

app.delete('/api/employees/:id', authorize('administrator'), async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

// Location Routes
app.get('/api/locations', async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

app.post('/api/locations', authorize('administrator'), async (req, res) => {
  try {
    const location = new Location(req.body);
    await location.save();
    res.status(201).json(location);
  } catch (error) {
    console.error('Error creating location:', error);
    res.status(400).json({ error: 'Failed to create location' });
  }
});

app.put('/api/locations/:id', authorize('administrator'), async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.json(location);
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(400).json({ error: 'Failed to update location' });
  }
});

app.delete('/api/locations/:id', authorize('administrator'), async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).json({ error: 'Failed to delete location' });
  }
});

// Denial Reason Routes
app.get('/api/denial-reasons', async (req, res) => {
  try {
    const denialReasons = await DenialReason.find();
    res.json(denialReasons);
  } catch (error) {
    console.error('Error fetching denial reasons:', error);
    res.status(500).json({ error: 'Failed to fetch denial reasons' });
  }
});

app.post('/api/denial-reasons', authorize('administrator'), async (req, res) => {
  try {
    const denialReason = new DenialReason(req.body);
    await denialReason.save();
    res.status(201).json(denialReason);
  } catch (error) {
    console.error('Error creating denial reason:', error);
    res.status(400).json({ error: 'Failed to create denial reason' });
  }
});

app.put('/api/denial-reasons/:id', authorize('administrator'), async (req, res) => {
  try {
    const denialReason = await DenialReason.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!denialReason) {
      return res.status(404).json({ error: 'Denial reason not found' });
    }
    res.json(denialReason);
  } catch (error) {
    console.error('Error updating denial reason:', error);
    res.status(400).json({ error: 'Failed to update denial reason' });
  }
});

app.delete('/api/denial-reasons/:id', authorize('administrator'), async (req, res) => {
  try {
    const denialReason = await DenialReason.findByIdAndDelete(req.params.id);
    if (!denialReason) {
      return res.status(404).json({ error: 'Denial reason not found' });
    }
    res.json({ message: 'Denial reason deleted successfully' });
  } catch (error) {
    console.error('Error deleting denial reason:', error);
    res.status(500).json({ error: 'Failed to delete denial reason' });
  }
});

// Vacation Request Routes
app.get('/api/vacation-requests', authorize('administrator', 'supervisor', 'employee'), async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'employee') {
      query.employee_id = req.user.id;
    } else if (req.user.role === 'supervisor') {
      const emps = await Employee.find({ location_id: req.user.location_id }).select('_id');
      query.employee_id = { $in: emps.map(e => e._id) };
    }
    const requests = await VacationRequest.find(query)
      .populate('employee_id', 'first_name last_name')
      .populate({
        path: 'employee_id',
        populate: {
          path: 'location_id',
          select: 'name'
        }
      })
      .populate('supervisor_id', 'first_name last_name')
      .populate('denial_reason_id', 'reason')
      .sort({ createdAt: -1 });
    
    // Transform the data to match the expected frontend format
    const transformedRequests = requests.map(request => ({
      id: request._id,
      employee_id: request.employee_id._id,
      first_name: request.employee_id.first_name,
      last_name: request.employee_id.last_name,
      location_name: request.employee_id.location_id?.name || 'N/A',
      start_date: request.start_date,
      end_date: request.end_date,
      days_requested: request.days_requested,
      reason: request.reason,
      status: request.status,
      supervisor_id: request.supervisor_id?._id,
      approval_date: request.approval_date,
      denial_reason: request.denial_reason_id?.reason,
      denial_comments: request.denial_comments,
      denial_date: request.denial_date,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt
    }));
    
    res.json(transformedRequests);
  } catch (error) {
    console.error('Error fetching vacation requests:', error);
    res.status(500).json({ error: 'Failed to fetch vacation requests' });
  }
});

app.post('/api/vacation-requests', authorize('administrator', 'supervisor', 'employee'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.user.role === 'employee') {
      data.employee_id = req.user.id;
    }
    const request = new VacationRequest(data);
    await request.save();
    await request.populate('employee_id', 'first_name last_name');
    res.status(201).json(request);
  } catch (error) {
    console.error('Error creating vacation request:', error);
    res.status(400).json({ error: 'Failed to create vacation request' });
  }
});

app.put('/api/vacation-requests/:id/approve', authorize('administrator', 'supervisor'), async (req, res) => {
  try {
    const { supervisor_id } = req.body;
    const request = await VacationRequest.findById(req.params.id).populate('employee_id');
    if (!request) {
      return res.status(404).json({ error: 'Vacation request not found' });
    }
    if (
      req.user.role === 'supervisor' &&
      String(request.employee_id.location_id) !== String(req.user.location_id)
    ) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    request.status = 'approved';
    request.supervisor_id = supervisor_id;
    request.approval_date = new Date();
    await request.save();
    await request.populate('employee_id', 'first_name last_name');
    res.json(request);
  } catch (error) {
    console.error('Error approving vacation request:', error);
    res.status(400).json({ error: 'Failed to approve vacation request' });
  }
});

app.put('/api/vacation-requests/:id/deny', authorize('administrator', 'supervisor'), async (req, res) => {
  try {
    const { denial_reason_id, denial_comments, supervisor_id } = req.body;
    const request = await VacationRequest.findById(req.params.id).populate('employee_id');
    if (!request) {
      return res.status(404).json({ error: 'Vacation request not found' });
    }
    if (
      req.user.role === 'supervisor' &&
      String(request.employee_id.location_id) !== String(req.user.location_id)
    ) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    request.status = 'denied';
    request.denial_reason_id = denial_reason_id;
    request.denial_comments = denial_comments;
    request.supervisor_id = supervisor_id;
    request.denial_date = new Date();
    await request.save();
    await request.populate('employee_id', 'first_name last_name');
    res.json(request);
  } catch (error) {
    console.error('Error denying vacation request:', error);
    res.status(400).json({ error: 'Failed to deny vacation request' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', database: 'MongoDB', timestamp: new Date().toISOString() });
});

// Dashboard stats endpoint
app.get('/api/dashboard/stats', authorize('administrator', 'supervisor'), async (req, res) => {
  try {
    const [employees, locations, vacationRequests, denialReasons] = await Promise.all([
      Employee.find(),
      Location.find(),
      VacationRequest.find().populate('employee_id', 'first_name last_name'),
      DenialReason.find({ active: true })
    ]);

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
          port: '27017',
          database: 'vacation_app',
          status: 'connected',
          connectionString: 'mongodb://localhost:27017/vacation_app'
        }
      },
      employees: {
        total: employees.length,
        supervisors: employees.filter(emp => emp.role === 'supervisor').length
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
          employee: req.employee_id ? `${req.employee_id.first_name} ${req.employee_id.last_name}` : 'Unknown',
          start_date: req.start_date,
          days: req.days_requested || Math.ceil((new Date(req.end_date) - new Date(req.start_date)) / (1000 * 60 * 60 * 24)) + 1,
          status: req.status,
          created: req.created_at || req.request_date
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
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Dashboard activity endpoint
app.get('/api/dashboard/activity', authorize('administrator', 'supervisor'), async (req, res) => {
  try {
    const vacationRequests = await VacationRequest.find()
      .populate('employee_id', 'first_name last_name');
    
    const employeeCounts = {};
    
    vacationRequests.forEach(req => {
      const employeeName = req.employee_id ? `${req.employee_id.first_name} ${req.employee_id.last_name}` : 'Unknown';
      if (!employeeCounts[employeeName]) {
        employeeCounts[employeeName] = { requests: 0, totalDays: 0 };
      }
      employeeCounts[employeeName].requests++;
      const days = req.days_requested || Math.ceil((new Date(req.end_date) - new Date(req.start_date)) / (1000 * 60 * 60 * 24)) + 1;
      employeeCounts[employeeName].totalDays += days;
    });
    
    const topRequesters = Object.entries(employeeCounts)
      .map(([employee, data]) => ({ employee, ...data }))
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 5);
    
    res.json({
      topRequesters
    });
  } catch (error) {
    console.error('Error fetching dashboard activity:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard activity' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
