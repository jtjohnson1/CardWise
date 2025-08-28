#!/bin/bash

# CardWise Application Deployment Script
# This script automates the deployment process for the CardWise application

set -e  # Exit on any error

echo "🚀 Starting CardWise Application Deployment..."

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
check_nodejs() {
    print_status "Checking Node.js installation..."
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 16 or higher."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        print_error "Node.js version 16 or higher is required. Current version: $(node --version)"
        exit 1
    fi
    
    print_success "Node.js $(node --version) is installed"
}

# Check if MongoDB is running
check_mongodb() {
    print_status "Checking MongoDB connection..."
    if ! command -v mongosh &> /dev/null; then
        print_warning "MongoDB shell (mongosh) not found. Trying with mongo..."
        if ! command -v mongo &> /dev/null; then
            print_error "MongoDB is not installed or not in PATH"
            exit 1
        fi
        MONGO_CMD="mongo"
    else
        MONGO_CMD="mongosh"
    fi
    
    # Test MongoDB connection
    if ! $MONGO_CMD --eval "db.runCommand('ping')" --quiet > /dev/null 2>&1; then
        print_error "Cannot connect to MongoDB. Please ensure MongoDB is running."
        print_status "You can start MongoDB with: sudo systemctl start mongod"
        exit 1
    fi
    
    print_success "MongoDB is running and accessible"
}

# Install dependencies
install_dependencies() {
    print_status "Installing server dependencies..."
    cd server
    if [ ! -f "package.json" ]; then
        print_error "Server package.json not found"
        exit 1
    fi
    npm install
    cd ..
    
    print_status "Installing client dependencies..."
    cd client
    if [ ! -f "package.json" ]; then
        print_error "Client package.json not found"
        exit 1
    fi
    npm install
    cd ..
    
    print_success "All dependencies installed successfully"
}

# Setup environment variables
setup_environment() {
    print_status "Setting up environment variables..."
    
    if [ ! -f "server/.env" ]; then
        print_status "Creating server/.env file..."
        cat > server/.env << EOF
# Port to listen on
PORT=3000

# MongoDB database URL
DATABASE_URL=mongodb://localhost/CardWise

# JWT Secrets (generate secure secrets for production)
JWT_SECRET=your-jwt-secret-key-here
REFRESH_TOKEN_SECRET=your-refresh-token-secret-here
EOF
        print_warning "Created server/.env with default values. Please update JWT secrets for production."
    else
        print_success "Environment file already exists"
    fi
}

# Start the server in background
start_server() {
    print_status "Starting CardWise server..."
    cd server
    
    # Kill any existing process on port 3000
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Port 3000 is in use. Attempting to free it..."
        kill -9 $(lsof -Pi :3000 -sTCP:LISTEN -t) 2>/dev/null || true
        sleep 2
    fi
    
    # Start server in background
    nohup npm start > ../server.log 2>&1 &
    SERVER_PID=$!
    echo $SERVER_PID > ../server.pid
    
    cd ..
    
    # Wait for server to start
    print_status "Waiting for server to start..."
    for i in {1..30}; do
        if curl -s http://localhost:3000 > /dev/null 2>&1; then
            print_success "Server started successfully (PID: $SERVER_PID)"
            return 0
        fi
        sleep 1
    done
    
    print_error "Server failed to start within 30 seconds"
    print_status "Check server.log for details:"
    tail -n 20 server.log
    exit 1
}

# Seed the database
seed_database() {
    print_status "Seeding database with admin user..."
    
    # Wait a bit more for server to be fully ready
    sleep 3
    
    # Seed admin user
    ADMIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/seed/admin)
    if echo "$ADMIN_RESPONSE" | grep -q '"success":true'; then
        print_success "Admin user seeded successfully"
        echo "Admin credentials: admin@cardwise.com / admin123"
    else
        print_error "Failed to seed admin user"
        echo "Response: $ADMIN_RESPONSE"
        exit 1
    fi
    
    print_status "Seeding database with sample cards..."
    
    # Seed sample cards
    CARDS_RESPONSE=$(curl -s -X POST http://localhost:3000/api/seed/cards)
    if echo "$CARDS_RESPONSE" | grep -q '"success":true'; then
        CARDS_COUNT=$(echo "$CARDS_RESPONSE" | grep -o '"cardsCount":[0-9]*' | cut -d':' -f2)
        print_success "Sample cards seeded successfully ($CARDS_COUNT cards)"
    else
        print_error "Failed to seed sample cards"
        echo "Response: $CARDS_RESPONSE"
        exit 1
    fi
}

# Start the client
start_client() {
    print_status "Starting CardWise client..."
    cd client
    
    # Kill any existing process on port 5173
    if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Port 5173 is in use. Attempting to free it..."
        kill -9 $(lsof -Pi :5173 -sTCP:LISTEN -t) 2>/dev/null || true
        sleep 2
    fi
    
    # Start client in background
    nohup npm run dev > ../client.log 2>&1 &
    CLIENT_PID=$!
    echo $CLIENT_PID > ../client.pid
    
    cd ..
    
    # Wait for client to start
    print_status "Waiting for client to start..."
    for i in {1..30}; do
        if curl -s http://localhost:5173 > /dev/null 2>&1; then
            print_success "Client started successfully (PID: $CLIENT_PID)"
            return 0
        fi
        sleep 1
    done
    
    print_error "Client failed to start within 30 seconds"
    print_status "Check client.log for details:"
    tail -n 20 client.log
    exit 1
}

# Cleanup function
cleanup() {
    print_status "Cleaning up..."
    if [ -f "server.pid" ]; then
        SERVER_PID=$(cat server.pid)
        kill $SERVER_PID 2>/dev/null || true
        rm server.pid
    fi
    if [ -f "client.pid" ]; then
        CLIENT_PID=$(cat client.pid)
        kill $CLIENT_PID 2>/dev/null || true
        rm client.pid
    fi
}

# Handle script interruption
trap cleanup EXIT INT TERM

# Main deployment process
main() {
    print_status "CardWise Application Deployment Started"
    print_status "========================================"
    
    # Pre-flight checks
    check_nodejs
    check_mongodb
    
    # Setup
    setup_environment
    install_dependencies
    
    # Start services
    start_server
    seed_database
    start_client
    
    print_success "========================================"
    print_success "🎉 CardWise Application Deployed Successfully!"
    print_success "========================================"
    echo ""
    print_status "Application URLs:"
    echo "  • Frontend: http://localhost:5173"
    echo "  • Backend API: http://localhost:3000"
    echo ""
    print_status "Admin Login Credentials:"
    echo "  • Email: admin@cardwise.com"
    echo "  • Password: admin123"
    echo ""
    print_status "Logs:"
    echo "  • Server: ./server.log"
    echo "  • Client: ./client.log"
    echo ""
    print_status "To stop the application, run: ./stop.sh"
    echo ""
    print_warning "Press Ctrl+C to stop all services"
    
    # Keep script running
    while true; do
        sleep 1
    done
}

# Run main function
main "$@"