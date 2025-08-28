#!/bin/bash

# CardWise Application Deployment Script
# This script deploys the CardWise application in production mode

set -e  # Exit on any error

echo "🚀 Starting CardWise deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 16+ to continue."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    print_error "Node.js version 16 or higher is required. Current version: $(node --version)"
    exit 1
fi

print_success "Node.js $(node --version) is installed"

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    print_warning "MongoDB is not running. Attempting to start MongoDB..."
    if command -v systemctl &> /dev/null; then
        sudo systemctl start mongod
        print_success "MongoDB started via systemctl"
    elif command -v brew &> /dev/null; then
        brew services start mongodb-community
        print_success "MongoDB started via brew"
    else
        print_error "Could not start MongoDB automatically. Please start MongoDB manually."
        exit 1
    fi
else
    print_success "MongoDB is running"
fi

# Create production environment file if it doesn't exist
if [ ! -f "server/.env" ]; then
    print_status "Creating production environment file..."
    cat > server/.env << EOF
# Production Environment Configuration
PORT=3000
DATABASE_URL=mongodb://localhost/CardWise
JWT_SECRET=$(openssl rand -base64 32)
REFRESH_TOKEN_SECRET=$(openssl rand -base64 32)
NODE_ENV=production
EOF
    print_success "Environment file created"
else
    print_status "Environment file already exists"
fi

# Install dependencies
print_status "Installing dependencies..."
npm install
print_success "Root dependencies installed"

cd client
npm install
print_success "Client dependencies installed"

cd ../server
npm install
print_success "Server dependencies installed"

cd ..

# Enable production mode by switching from mock to real API calls
print_status "Configuring production mode (enabling real API calls)..."

# Function to enable production mode in API files
enable_production_api() {
    local file=$1
    print_status "Enabling production API calls in $file..."
    
    # Create backup
    cp "$file" "$file.backup"
    
    # Use sed to comment out mock responses and uncomment real API calls
    sed -i.tmp '
        # Comment out mock responses (lines that start with "return new Promise")
        /return new Promise/,/});/ {
            s/^/  \/\/ /
        }
        # Uncomment real API calls (lines that start with "// try")
        s/^  \/\/ try {/  try {/
        s/^  \/\/ /  /
        # But dont uncomment the mock response comments
        /\/\/ return new Promise/,/\/\/ });/ {
            s/^  /  \/\/ /
        }
    ' "$file"
    
    # Remove temporary file
    rm "$file.tmp" 2>/dev/null || true
    
    print_success "Production mode enabled in $file"
}

# Enable production mode for all API files
API_FILES=(
    "client/src/api/cards.ts"
    "client/src/api/scanning.ts"
    "client/src/api/seed.ts"
    "client/src/api/settings.ts"
    "client/src/api/wishlist.ts"
    "client/src/api/ebay.ts"
)

for file in "${API_FILES[@]}"; do
    if [ -f "$file" ]; then
        enable_production_api "$file"
    else
        print_warning "API file not found: $file"
    fi
done

# Build the client for production
print_status "Building client for production..."
cd client
npm run build
print_success "Client built successfully"

cd ..

# Start the application
print_status "Starting CardWise application..."

# Kill any existing processes
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# Start the server in background
cd server
nohup npm start > ../server.log 2>&1 &
SERVER_PID=$!
cd ..

# Wait for server to start
print_status "Waiting for server to start..."
sleep 5

# Check if server is running
if kill -0 $SERVER_PID 2>/dev/null; then
    print_success "Server started successfully (PID: $SERVER_PID)"
else
    print_error "Server failed to start. Check server.log for details."
    exit 1
fi

# Serve the built client files (in production, you'd use nginx or similar)
print_status "Starting production client server..."
cd client
nohup npx serve -s dist -l 5173 > ../client.log 2>&1 &
CLIENT_PID=$!
cd ..

# Wait for client server to start
sleep 3

# Check if client server is running
if kill -0 $CLIENT_PID 2>/dev/null; then
    print_success "Client server started successfully (PID: $CLIENT_PID)"
else
    print_error "Client server failed to start. Check client.log for details."
    exit 1
fi

# Save PIDs for later management
echo $SERVER_PID > server.pid
echo $CLIENT_PID > client.pid

# Test the deployment
print_status "Testing deployment..."

# Test server health
if curl -s http://localhost:3000/api/seed/admin > /dev/null; then
    print_success "Server is responding"
else
    print_error "Server is not responding"
    exit 1
fi

# Test client
if curl -s http://localhost:5173 > /dev/null; then
    print_success "Client is responding"
else
    print_error "Client is not responding"
    exit 1
fi

# Final success message
print_success "🎉 CardWise deployed successfully!"
echo ""
echo "📊 Application URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3000"
echo ""
echo "📝 Log files:"
echo "   Server:   server.log"
echo "   Client:   client.log"
echo ""
echo "🛑 To stop the application:"
echo "   ./stop.sh"
echo ""
echo "📈 To check status:"
echo "   ./status.sh"
echo ""
print_status "Deployment complete! Your CardWise application is now running in production mode."