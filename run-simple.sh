#!/bin/bash

echo "🚀 Starting Vacation App (Simple Mode)..."

# Kill existing processes
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Start simple test server
echo "🔧 Starting simple backend server..."
node test-simple.js &
BACKEND_PID=$!

echo "⚛️  Starting React frontend..."
cd client && npm start &
FRONTEND_PID=$!

echo ""
echo "✅ App started!"
echo "📱 Frontend: http://localhost:3000" 
echo "🔧 Test Backend: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop"

cleanup() {
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    lsof -ti:3000,3001 | xargs kill -9 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM
wait