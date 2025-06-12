#!/bin/bash

echo "🚀 Starting Vacation App (Simple Mode)..."

# Kill existing processes
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
    kill_port 3000
    kill_port 3001
    exit 0
}

trap cleanup SIGINT SIGTERM
wait
