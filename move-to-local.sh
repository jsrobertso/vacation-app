#!/bin/bash

# Move Vacation App to Local Directory
echo "📦 Moving Vacation App to local directory..."

LOCAL_DIR="$HOME/vacation-app"

# Remove existing local directory if it exists
if [ -d "$LOCAL_DIR" ]; then
    echo "🧹 Removing existing local directory..."
    rm -rf "$LOCAL_DIR"
fi

# Create local directory
echo "📁 Creating local directory at: $LOCAL_DIR"
mkdir -p "$LOCAL_DIR"

# Copy files manually to avoid OneDrive sync issues
echo "📋 Copying files (this may take a moment)..."

# Copy essential files one by one to avoid timeout
cp README.md "$LOCAL_DIR/" 2>/dev/null || echo "⚠️  Could not copy README.md"
cp package.json "$LOCAL_DIR/" 2>/dev/null || echo "⚠️  Could not copy package.json"
cp server.js "$LOCAL_DIR/" 2>/dev/null || echo "⚠️  Could not copy server.js"
cp server_mongodb.js "$LOCAL_DIR/" 2>/dev/null || echo "⚠️  Could not copy server_mongodb.js"
cp seed.js "$LOCAL_DIR/" 2>/dev/null || echo "⚠️  Could not copy seed.js"
cp database.js "$LOCAL_DIR/" 2>/dev/null || echo "⚠️  Could not copy database.js"
cp .gitignore "$LOCAL_DIR/" 2>/dev/null || echo "⚠️  Could not copy .gitignore"

# Copy directories
echo "📂 Copying directories..."
cp -r client "$LOCAL_DIR/" 2>/dev/null || echo "⚠️  Could not copy client directory"
cp -r config "$LOCAL_DIR/" 2>/dev/null || echo "⚠️  Could not copy config directory"
cp -r models "$LOCAL_DIR/" 2>/dev/null || echo "⚠️  Could not copy models directory"

# Copy scripts
echo "🔧 Copying scripts..."
cp *.sh "$LOCAL_DIR/" 2>/dev/null || echo "⚠️  Could not copy some scripts"

# Clean up node_modules in local copy (we'll reinstall fresh)
echo "🧹 Cleaning up node_modules..."
rm -rf "$LOCAL_DIR/node_modules" "$LOCAL_DIR/client/node_modules" 2>/dev/null

echo ""
echo "✅ Project moved to local directory!"
echo "📍 Location: $LOCAL_DIR"
echo ""
echo "🎯 Next steps:"
echo "   cd $LOCAL_DIR"
echo "   npm install"
echo "   cd client && npm install && cd .."
echo "   ./run.sh"