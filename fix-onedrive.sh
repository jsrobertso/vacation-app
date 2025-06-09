#!/bin/bash

# Fix OneDrive Sync Issues - Copy to Local Directory
echo "🔧 Fixing OneDrive sync issues..."

LOCAL_DIR="$HOME/vacation-app-local"

# Create local directory
echo "📁 Creating local copy at: $LOCAL_DIR"
mkdir -p "$LOCAL_DIR"

# Copy all necessary files (excluding node_modules and client_backup)
echo "📋 Copying project files..."
rsync -av --exclude='node_modules' --exclude='client_backup' --exclude='.git' . "$LOCAL_DIR/"

# Make scripts executable
chmod +x "$LOCAL_DIR"/*.sh

# Install dependencies in the local copy
echo "📦 Installing dependencies in local directory..."
cd "$LOCAL_DIR"

# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..

echo "✅ Local copy created successfully!"
echo ""
echo "🎯 To run the app from the local directory:"
echo "   cd $LOCAL_DIR"
echo "   ./run.sh"
echo ""
echo "📝 Note: The local copy is at $LOCAL_DIR"
echo "   You can develop from there to avoid OneDrive sync issues."