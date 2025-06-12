#!/bin/bash

# Vacation Request Management App - Launch Script (Local Version)
echo "🚀 Starting Vacation Request Management App..."

# Use a project-local npm cache to avoid permissions issues
export NPM_CONFIG_CACHE="$PWD/.npm-cache"
mkdir -p "$NPM_CONFIG_CACHE"

# Kill any existing processes on ports 3000 and 3001
echo "📋 Cleaning up existing processes..."

kill_port() {
    local PORT=$1
    if command -v lsof >/dev/null 2>&1; then
        lsof -ti:"${PORT}" | xargs kill -9 2>/dev/null || true
    elif command -v fuser >/dev/null 2>&1; then
        fuser -k "${PORT}/tcp" >/dev/null 2>&1 || true
    else
        echo "⚠️  Neither lsof nor fuser found; using npx kill-port for ${PORT}" >&2
        npx --yes kill-port "${PORT}" >/dev/null 2>&1 || true
    fi
}

kill_port 3000
kill_port 3001

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

# Ensure critical modules are installed even if node_modules exists
if [ ! -f "node_modules/bcryptjs/package.json" ]; then
    echo "Missing bcryptjs module, installing..."
    npm install bcryptjs
fi

# Ensure nodemailer module for password reset emails
if [ ! -f "node_modules/nodemailer/package.json" ]; then
    echo "Missing nodemailer module, installing..."
    npm install nodemailer
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
    if ! timeout 1 bash -c "</dev/tcp/localhost/27017" 2>/dev/null; then
        echo "⚠️  MongoDB not reachable, falling back to server.js"
        SERVER_FILE="server.js"
    fi
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
    if [ "$SERVER_FILE" != "server.js" ]; then
        echo "ℹ️  Falling back to basic server.js"
        node server.js &
        BACKEND_PID=$!
        sleep 3
        if ! kill -0 $BACKEND_PID 2>/dev/null; then
            echo "❌ Fallback server failed to start"
            exit 1
        fi
    else
        exit 1
    fi
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
    kill_port 3000
    kill_port 3001
    echo "✅ All servers stopped"
    exit 0
}

# Set up signal handling
trap cleanup SIGINT SIGTERM

# Wait for either process to exit
wait
