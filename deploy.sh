#!/bin/bash

# CardWise Application Deployment Script
# This script sets up and starts the CardWise application locally

set -e  # Exit on any error

echo "🚀 Starting CardWise Application Deployment..."

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the CardWise root directory."
    exit 1
fi

# Check for required dependencies
echo "📋 Checking system requirements..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install Node.js 16+ and try again."
    exit 1
fi

# Check for MongoDB
if ! command -v mongod &> /dev/null && ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  Warning: MongoDB not found or not running. Starting MongoDB..."
    # Try to start MongoDB service
    if command -v systemctl &> /dev/null; then
        sudo systemctl start mongod || echo "Could not start MongoDB service"
    elif command -v brew &> /dev/null; then
        brew services start mongodb/brew/mongodb-community || echo "Could not start MongoDB via brew"
    else
        echo "❌ Error: Please start MongoDB manually before running this script."
        exit 1
    fi
fi

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

# Create production build of client
echo "🏗️  Building client for production..."
cd client
npm run build
cd ..

# Set up environment variables
echo "⚙️  Setting up environment variables..."
if [ ! -f "server/.env" ]; then
    echo "Creating server/.env file..."
    cat > server/.env << EOF
# Port to listen on
PORT=3000

# MongoDB database URL
DATABASE_URL=mongodb://localhost/CardWise

# JWT Secrets (generated)
JWT_SECRET=cardwise_jwt_secret_$(date +%s)
REFRESH_TOKEN_SECRET=cardwise_refresh_secret_$(date +%s)
EOF
else
    echo "server/.env already exists, skipping creation."
fi

# Start MongoDB if not running
echo "🗄️  Checking MongoDB connection..."
if ! mongosh --eval "db.runCommand('ping')" --quiet > /dev/null 2>&1; then
    echo "❌ Error: Cannot connect to MongoDB. Please ensure MongoDB is running on localhost:27017"
    exit 1
fi

# Function to cleanup processes on exit
cleanup() {
    echo "🧹 Cleaning up processes..."
    if [ ! -z "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null || true
    fi
    if [ ! -z "$CLIENT_PID" ]; then
        kill $CLIENT_PID 2>/dev/null || true
    fi
}

# Set trap to cleanup on script exit
trap cleanup EXIT INT TERM

# Start the server in background
echo "🖥️  Starting server..."
cd server
node server.js &
SERVER_PID=$!
cd ..

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 5

# Check if server is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Error: Server failed to start or is not responding on port 3000"
    exit 1
fi

# Test database seeding
echo "🌱 Testing database seeding..."
curl -s -X POST http://localhost:3000/api/seed/admin > /dev/null || echo "Admin seeding may have failed"
curl -s -X POST http://localhost:3000/api/seed/cards > /dev/null || echo "Cards seeding may have failed"

# Start the client in background
echo "🌐 Starting client..."
cd client
npm run dev &
CLIENT_PID=$!
cd ..

# Wait for client to start
echo "⏳ Waiting for client to start..."
sleep 5

echo "✅ CardWise Application Started Successfully!"
echo ""
echo "🔗 Application URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3000"
echo ""
echo "📊 API Endpoints Available:"
echo "   GET  /api/cards          - Get all cards"
echo "   POST /api/cards          - Create new card"
echo "   GET  /api/cards/stats    - Get collection statistics"
echo "   POST /api/seed/admin     - Seed admin user"
echo "   POST /api/seed/cards     - Seed sample cards"
echo "   GET  /api/settings/*     - Settings endpoints"
echo ""
echo "🗄️  Database:"
echo "   MongoDB: mongodb://localhost/CardWise"
echo ""
echo "Press Ctrl+C to stop the application..."

# Keep script running and show logs
wait
EOF

chmod +x deploy.sh