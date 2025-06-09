#!/bin/bash

# Vacation Request Management App - Launch Script (Local Version)
echo "🚀 Starting Vacation Request Management App..."

# Kill any existing processes on ports 3000 and 3001
echo "📋 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Check if we have the required files
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found!"
    exit 1
fi

if [ ! -f "server.js" ]; then
    echo "❌ server.js not found!"
    exit 1
fi

if [ ! -d "client" ]; then
    echo "❌ client directory not found!"
    exit 1
fi

# Install dependencies if needed
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd client && npm install && cd ..
fi

# Determine which server to use
SERVER_FILE="server.js"
if [ -f "server_mongodb.js" ] && [ -f "node_modules/mongoose/package.json" ]; then
    echo "✅ MongoDB dependencies found, using server_mongodb.js"
    SERVER_FILE="server_mongodb.js"
else
    echo "📝 Using basic server.js (in-memory data)"
fi

# Start the backend server
echo "🔧 Starting backend server on port 3001..."
node $SERVER_FILE &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Verify backend started
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Backend server failed to start"
    exit 1
fi

echo "✅ Backend server started (PID: $BACKEND_PID)"

# Start the frontend server
echo "⚛️  Starting React frontend on port 3000..."
cd client && npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ App started successfully!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:3001"
echo "🧪 API Test: http://localhost:3001/api/test"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
    echo "✅ All servers stopped"
    exit 0
}

# Set up signal handling
trap cleanup SIGINT SIGTERM

# Wait for either process to exit
wait
