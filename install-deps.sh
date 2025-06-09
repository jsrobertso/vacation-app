#!/bin/bash

# Install Dependencies Script for Vacation App
echo "📦 Installing Vacation App Dependencies..."

# Install backend dependencies with sudo
echo "🔧 Installing backend dependencies..."
sudo npm install --unsafe-perm=true --allow-root

# Install frontend dependencies
echo "⚛️  Installing frontend dependencies..."
cd client && npm install && cd ..

echo "✅ All dependencies installed successfully!"
echo "🚀 You can now run: ./run.sh"