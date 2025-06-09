# 🏖️ Vacation Request Management System

A comprehensive vacation request management application built with **React**, **Node.js**, and **MongoDB**. Features a complete system dashboard, employee management, and automated request processing workflows.

## 🚀 Features

### 📊 **System Dashboard**
- **Real-time system monitoring** with auto-refresh every 30 seconds
- **Connection information** for Frontend, Backend, and Database
- **Live performance metrics** (uptime, memory usage, Node.js version)
- **Visual analytics** with color-coded status indicators
- **Recent activity tracking** and top requesters analysis
- **Quick access links** to API endpoints and health checks

### 🏖️ **Vacation Request Management**
- **Submit vacation requests** with date range and reason
- **Automatic day calculation** based on start/end dates
- **Multi-status workflow**: Pending → Approved/Denied
- **Supervisor approval system** with detailed tracking
- **Request history** with status badges and timestamps

### 👥 **Employee Management**
- **Complete employee directory** with role-based access
- **Supervisor-employee relationships** with hierarchy display
- **Location assignment** and contact information
- **Role management** (Employee/Supervisor)
- **CRUD operations** with form validation

### 📍 **Location Management**
- **Office location tracking** (NYC, LA, Chicago, Remote, Austin)
- **Address management** with full contact details
- **Employee distribution** across locations
- **Location-based reporting** and analytics

### ❌ **Denial Reason Management**
- **Standardized denial reasons** with descriptions
- **Active/inactive status** management
- **Customizable reason categories** for consistent processing
- **Detailed denial comments** and supervisor tracking

## 🛠️ Technology Stack

### Frontend
- **React 18** with functional components and hooks
- **Bootstrap 5** for responsive UI design
- **Axios** for API communication
- **React Router** for navigation

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **RESTful API** design with comprehensive endpoints
- **Real-time system monitoring** and health checks

### Database
- **MongoDB** for scalable document storage
- **Mongoose schemas** with validation and relationships
- **Automatic seeding** with comprehensive demo data
- **Aggregation pipelines** for analytics and reporting

## 📁 Project Structure

```
Vaca/
├── vacation_mongodb/          # MongoDB Backend
│   ├── server.js             # Express server with dashboard APIs
│   ├── models/               # Mongoose schemas
│   │   ├── Employee.js       # Employee model with references
│   │   ├── Location.js       # Location model
│   │   ├── DenialReason.js   # Denial reason model
│   │   └── VacationRequest.js # Vacation request model
│   ├── config/
│   │   └── database.js       # MongoDB connection config
│   ├── seed.js               # Automatic data seeding
│   └── package.json          # Dependencies (mongoose, express, cors)
├── client/                   # React Frontend
│   ├── src/
│   │   ├── App.js           # Main application with navigation
│   │   ├── components/
│   │   │   ├── Dashboard.js          # System dashboard
│   │   │   ├── VacationRequests.js   # Request management
│   │   │   ├── ManageSystem.js       # System management hub
│   │   │   ├── EmployeeManager.js    # Employee CRUD
│   │   │   ├── LocationManager.js    # Location CRUD
│   │   │   └── DenialReasonManager.js # Denial reason CRUD
│   │   └── services/
│   │       └── api.js        # API service layer
│   └── package.json          # React dependencies
└── Documentation/
    ├── MONGODB_SETUP.md      # MongoDB setup instructions
    ├── MONGODB_SUCCESS.md    # Implementation summary
    ├── DASHBOARD_COMPLETE.md # Dashboard features
    └── DASHBOARD_UPDATED.md  # Recent updates
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14+ recommended)
- **MongoDB** (v4.4+ recommended)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Vaca
   ```

2. **Install Backend Dependencies**
   ```bash
   cd vacation_mongodb
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Start MongoDB**
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Or manually
   mongod --dbpath=/usr/local/var/mongodb
   ```

5. **Seed the Database (First Time Only)**
   ```bash
   cd vacation_mongodb
   node seed.js
   ```

6. **Start the Backend Server**
   ```bash
   cd vacation_mongodb
   node server.js
   ```

7. **Start the Frontend Client**
   ```bash
   cd client
   npm start
   ```

### 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 📊 Demo Data

The application comes with comprehensive demo data including:

- **5 Office Locations**: New York, Los Angeles, Chicago, Remote, Austin
- **13 Employees**: 3 supervisors and 10 employees with realistic relationships
- **10 Vacation Requests**: Mix of pending (4), approved (4), and denied (2) requests
- **6 Denial Reasons**: Common vacation denial scenarios with descriptions

## 🔗 API Endpoints

### Dashboard & System
- `GET /health` - System health check
- `GET /api/dashboard/stats` - Comprehensive system statistics
- `GET /api/dashboard/activity` - Activity analytics and trends

### Employee Management
- `GET /api/employees` - Get all employees with populated references
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Location Management
- `GET /api/locations` - Get all locations
- `POST /api/locations` - Create new location
- `PUT /api/locations/:id` - Update location
- `DELETE /api/locations/:id` - Delete location

### Vacation Requests
- `GET /api/vacation-requests` - Get all requests with employee details
- `POST /api/vacation-requests` - Create new request
- `PUT /api/vacation-requests/:id/approve` - Approve request
- `PUT /api/vacation-requests/:id/deny` - Deny request with reason

### Denial Reasons
- `GET /api/denial-reasons` - Get all denial reasons
- `POST /api/denial-reasons` - Create new denial reason
- `PUT /api/denial-reasons/:id` - Update denial reason
- `DELETE /api/denial-reasons/:id` - Delete denial reason

## 🎯 Key Features in Detail

### System Dashboard
- **Connection Monitoring**: Real-time status of Frontend (port 3000), Backend (port 3001), and Database (port 27017)
- **Performance Metrics**: Memory usage, uptime tracking, Node.js version monitoring
- **Visual Analytics**: Progress bars, status badges, and color-coded indicators
- **Activity Feed**: Recent vacation requests with employee details and status
- **Top Users**: Most active requesters with total days and request counts
- **Quick Actions**: Direct links to API documentation and health endpoints

### Smart Request Management
- **Automatic Calculations**: Days requested calculated from date ranges
- **Workflow Management**: Pending → Approved/Denied status progression
- **Supervisor Tracking**: Approval/denial history with supervisor identification
- **Rich Filtering**: Status-based filtering and search capabilities

### Advanced Employee System
- **Hierarchical Structure**: Supervisor-employee relationships with visual indicators
- **Cross-Referenced Data**: Location and supervisor information populated in displays
- **Role-Based Display**: Different views for employees vs supervisors
- **Comprehensive Profiles**: Full contact information and organizational details

## 🔧 Configuration

### MongoDB Connection
Default connection string: `mongodb://localhost:27017/vacation_app`

To use a different MongoDB instance, set the environment variable:
```bash
export MONGODB_URI="mongodb://your-host:port/your-database"
```

### Port Configuration
- **Frontend**: Port 3000 (React development server)
- **Backend**: Port 3001 (Express server)
- **Database**: Port 27017 (MongoDB default)

## 🚀 Deployment

### Development
Both frontend and backend run in development mode with hot reloading enabled.

### Production Build
```bash
# Build frontend for production
cd client
npm run build

# Start backend in production mode
cd vacation_mongodb
NODE_ENV=production node server.js
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the documentation files in the project root
- Review API endpoints at http://localhost:3001
- Monitor system health at http://localhost:3001/health

---

**Built with ❤️ using React, Node.js, and MongoDB**