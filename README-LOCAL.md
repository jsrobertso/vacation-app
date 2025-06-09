# Vacation App - Local Installation

## 📍 Location
This is the local copy of the vacation app, moved from OneDrive to avoid file system sync issues.

**Directory**: `/Users/jon/vacation-app`

## 🚀 Quick Start

```bash
cd /Users/jon/vacation-app
npm install
cd client && npm install && cd ..
./run.sh
```

## 📋 Available Commands

### Start the App
```bash
./run.sh
```

### Stop the App
```bash
./stop.sh
```

## 🔧 What's Different in Local Version

### **Enhanced run.sh Script**
- ✅ File existence validation
- ✅ Dependency checking and auto-install
- ✅ Smart server selection (MongoDB vs basic)
- ✅ Process verification
- ✅ Better error handling
- ✅ No OneDrive sync warnings

### **Improved stop.sh Script**
- ✅ Graceful shutdown attempts
- ✅ Force kill fallback
- ✅ Process pattern matching
- ✅ Comprehensive verification
- ✅ Better user feedback

### **Simplified server.js**
- ✅ Works without MongoDB dependencies
- ✅ In-memory data store
- ✅ Full REST API endpoints
- ✅ No file system timeouts

## 🌐 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Test**: http://localhost:3001/api/test

## 🔄 Server Selection Logic

The app automatically chooses the best server:

1. **If MongoDB dependencies exist**: Uses `server_mongodb.js`
2. **Otherwise**: Uses basic `server.js` with in-memory data

## 📁 Project Structure

```
/Users/jon/vacation-app/
├── client/          # React frontend
├── config/          # Database config
├── models/          # Data models
├── package.json     # Backend dependencies
├── server.js        # Basic server (no DB)
├── server_mongodb.js # MongoDB server
├── run.sh          # Start script
├── stop.sh         # Stop script
└── README-LOCAL.md # This file
```

## 🎯 Next Steps

1. **Install dependencies**: `npm install`
2. **Install frontend deps**: `cd client && npm install && cd ..`
3. **Run the app**: `./run.sh`
4. **Visit**: http://localhost:3000

The local version should work without any timeout issues!