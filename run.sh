#!/bin/bash

# Vacation Request Management App - Startup Script

set -e

echo "🚀 Starting Vacation Request Management App..."

# Use project-local npm cache
export NPM_CONFIG_CACHE="$PWD/.npm-cache"
mkdir -p "$NPM_CONFIG_CACHE"

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

check_requirements() {
    if [ ! -f package.json ]; then
        echo "❌ package.json not found" >&2
        exit 1
    fi
    if [ ! -f server_mongodb.js ]; then
        echo "❌ server_mongodb.js missing" >&2
        exit 1
    fi
    if [ ! -d client ]; then
        echo "❌ client directory missing" >&2
        exit 1
    fi
}

install_deps() {
    echo "📦 Checking dependencies..."
    if [ ! -d node_modules ]; then
        npm install
    fi
    if [ ! -d client/node_modules ]; then
        npm install --prefix client
    fi
    if [ ! -f node_modules/mongoose/package.json ]; then
        npm install mongoose --no-save
    fi
    if [ ! -f node_modules/mongodb-memory-server/package.json ] && \
       [ ! -f node_modules/mongodb-memory-server-core/package.json ]; then
        npm install mongodb-memory-server --no-save
    fi
}

ensure_mongodb() {
    if timeout 1 bash -c "</dev/tcp/localhost/27017" 2>/dev/null; then
        echo "✅ MongoDB running on port 27017"
        return
    fi

    if command -v mongod >/dev/null 2>&1; then
        echo "⚙️  Starting local mongod on port 27017..."
        mkdir -p data/db
        mongod --dbpath data/db --bind_ip localhost --port 27017 --fork --logpath mongod.log
        sleep 3
        if timeout 1 bash -c "</dev/tcp/localhost/27017" 2>/dev/null; then
            echo "✅ MongoDB started"
            MONGO_PID=$(pgrep -f "--dbpath data/db" | head -n 1)
            return
        fi
        echo "❌ Failed to start MongoDB" >&2
        exit 1
    fi

    echo "⚙️  Starting in-memory MongoDB..."
    node mongo-runner.js &
    MONGO_PID=$!
    sleep 3
    if timeout 1 bash -c "</dev/tcp/localhost/27017" 2>/dev/null; then
        echo "✅ In-memory MongoDB started (PID: $MONGO_PID)"
        return
    fi
    echo "❌ Failed to start in-memory MongoDB" >&2
    exit 1
}

start_backend() {
    echo "🔧 Starting backend server on port 3001..."
    node server_mongodb.js &
    BACKEND_PID=$!
    sleep 3
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo "❌ Backend failed to start" >&2
        exit 1
    fi
    echo "✅ Backend started (PID: $BACKEND_PID)"
}

start_frontend() {
    echo "⚛️  Starting React frontend on port 3000..."
    npm start --prefix client &
    FRONTEND_PID=$!
}

cleanup() {
    echo "\n🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    if [ -n "$MONGO_PID" ]; then
        kill $MONGO_PID 2>/dev/null || true
    fi
    kill_port 3000
    kill_port 3001
    echo "✅ All servers stopped"
    exit 0
}

trap cleanup SIGINT SIGTERM

check_requirements
install_deps
ensure_mongodb
start_backend
start_frontend

echo ""
echo "✅ App started successfully!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:3001"
echo "🧪 API Test: http://localhost:3001/api/test"
echo ""
echo "Press Ctrl+C to stop all servers"

wait
