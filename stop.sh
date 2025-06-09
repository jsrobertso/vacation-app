#!/bin/bash

# Stop Vacation Request Management App - Local Version
echo "🛑 Stopping Vacation Request Management App..."

# Function to check if a process is running on a port
check_port() {
    local port=$1
    local pid=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pid" ]; then
        echo "📍 Found process $pid running on port $port"
        return 0
    else
        return 1
    fi
}

# Function to kill processes on a specific port with retries
kill_port() {
    local port=$1
    local name=$2
    echo "🔍 Checking port $port ($name)..."
    
    if check_port $port; then
        echo "⏹️  Stopping $name on port $port..."
        
        # Try graceful shutdown first
        lsof -ti:$port | xargs kill -TERM 2>/dev/null
        sleep 2
        
        # Check if still running
        if check_port $port; then
            echo "🔨 Force stopping $name..."
            lsof -ti:$port | xargs kill -9 2>/dev/null
            sleep 1
        fi
        
        # Final verification
        if check_port $port; then
            echo "❌ Failed to stop $name on port $port"
            echo "💡 You may need to manually run: sudo lsof -ti:$port | xargs kill -9"
            return 1
        else
            echo "✅ $name stopped successfully"
            return 0
        fi
    else
        echo "✅ $name not running on port $port"
        return 0
    fi
}

# Stop frontend (React dev server)
kill_port 3000 "Frontend (React)"

# Stop backend (Node.js server)
kill_port 3001 "Backend (Node.js)"

# Clean up any remaining vacation app processes
echo "🧹 Cleaning up remaining processes..."

# Look for specific process patterns
processes_killed=0

for pattern in "server.js" "server_mongodb.js" "react-scripts start"; do
    pids=$(pgrep -f "$pattern" 2>/dev/null)
    if [ ! -z "$pids" ]; then
        echo "🔍 Found $pattern processes: $pids"
        echo "$pids" | xargs kill -TERM 2>/dev/null
        processes_killed=1
        sleep 1
        
        # Force kill if still running
        pids=$(pgrep -f "$pattern" 2>/dev/null)
        if [ ! -z "$pids" ]; then
            echo "🔨 Force stopping $pattern processes..."
            echo "$pids" | xargs kill -9 2>/dev/null
        fi
    fi
done

if [ $processes_killed -eq 0 ]; then
    echo "✅ No additional processes found"
fi

echo ""
echo "🎯 Final verification..."

# Final port check
frontend_running=false
backend_running=false

if check_port 3000; then
    frontend_running=true
fi

if check_port 3001; then
    backend_running=true
fi

# Summary
if [ "$frontend_running" = false ] && [ "$backend_running" = false ]; then
    echo "🎉 All vacation app servers stopped successfully!"
    echo "🚀 Ready to run ./run.sh again"
else
    echo "⚠️  Some processes may still be running:"
    if [ "$frontend_running" = true ]; then
        echo "   • Frontend still on port 3000"
    fi
    if [ "$backend_running" = true ]; then
        echo "   • Backend still on port 3001"
    fi
    echo ""
    echo "💡 Try running this script again or manually kill with:"
    echo "   sudo lsof -ti:3000,3001 | xargs kill -9"
fi
