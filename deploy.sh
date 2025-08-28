#!/bin/bash

# CardWise Application Deployment Script
# This script deploys the CardWise application with all dependencies

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

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root for security reasons"
   exit 1
fi

print_status "Checking system requirements..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node --version)"
    exit 1
fi
print_success "Node.js $(node --version) found"

# Check for npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi
print_success "npm $(npm --version) found"

# Check for MongoDB
if ! command -v mongosh &> /dev/null && ! command -v mongo &> /dev/null; then
    print_warning "MongoDB shell not found. Please ensure MongoDB is installed and running."
    print_status "You can install MongoDB from: https://www.mongodb.com/try/download/community"
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    print_warning "MongoDB service doesn't appear to be running"
    print_status "Please start MongoDB service before continuing"
    print_status "On Ubuntu/Debian: sudo systemctl start mongod"
    print_status "On macOS with Homebrew: brew services start mongodb-community"
fi

print_status "Creating application directory structure..."

# Create necessary directories
mkdir -p /opt/CardWise/logs
mkdir -p /opt/CardWise/backups
mkdir -p /opt/scanimg
mkdir -p /opt/cardimg

print_success "Directory structure created"

print_status "Installing server dependencies..."
cd server
if [ ! -f "package.json" ]; then
    print_error "Server package.json not found. Please ensure you're in the correct directory."
    exit 1
fi

npm install
print_success "Server dependencies installed"

print_status "Installing client dependencies..."
cd ../client
if [ ! -f "package.json" ]; then
    print_error "Client package.json not found. Please ensure you're in the correct directory."
    exit 1
fi

npm install
print_success "Client dependencies installed"

print_status "Setting up environment variables..."
cd ../server

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating server .env file..."
    cat > .env << EOF
# Port to listen on
PORT=3000

# MongoDB database URL
DATABASE_URL=mongodb://localhost/CardWise

# JWT Secrets (generate your own in production)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
REFRESH_TOKEN_SECRET=your-super-secret-refresh-key-change-in-production

# Ollama Configuration
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llava:latest

# eBay API Configuration (optional - configure in app settings)
EBAY_APP_ID=
EBAY_DEV_ID=
EBAY_CERT_ID=
EBAY_USER_TOKEN=

# TCGPlayer API Configuration (optional - configure in app settings)
TCGPLAYER_API_KEY=
TCGPLAYER_PARTNER_ID=
EOF
    print_success "Server .env file created"
else
    print_success "Server .env file already exists"
fi

cd ..

print_status "Building client application..."
cd client
npm run build
print_success "Client application built successfully"

cd ..

print_status "Testing database connection..."
cd server

# Test MongoDB connection
if command -v mongosh &> /dev/null; then
    if mongosh --eval "db.adminCommand('ping')" --quiet > /dev/null 2>&1; then
        print_success "MongoDB connection successful"
    else
        print_error "Cannot connect to MongoDB. Please ensure MongoDB is running."
        exit 1
    fi
elif command -v mongo &> /dev/null; then
    if mongo --eval "db.adminCommand('ping')" --quiet > /dev/null 2>&1; then
        print_success "MongoDB connection successful"
    else
        print_error "Cannot connect to MongoDB. Please ensure MongoDB is running."
        exit 1
    fi
fi

print_status "Seeding initial data..."

# Start the server in background for seeding
print_status "Starting server for initial setup..."
node server.js &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Seed admin user
print_status "Creating admin user..."
ADMIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/seed/admin)
if echo "$ADMIN_RESPONSE" | grep -q "success.*true"; then
    print_success "Admin user created successfully"
else
    print_warning "Admin user creation response: $ADMIN_RESPONSE"
fi

# Seed sample cards
print_status "Creating sample cards..."
CARDS_RESPONSE=$(curl -s -X POST http://localhost:3000/api/seed/cards)
if echo "$CARDS_RESPONSE" | grep -q "success.*true"; then
    print_success "Sample cards created successfully"
else
    print_warning "Sample cards creation response: $CARDS_RESPONSE"
fi

# Stop the background server
kill $SERVER_PID 2>/dev/null || true
wait $SERVER_PID 2>/dev/null || true

print_status "Creating systemd service (optional)..."

# Create systemd service file
if [ -d "/etc/systemd/system" ]; then
    cat > /tmp/cardwise.service << EOF
[Unit]
Description=CardWise Application
After=network.target mongod.service

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)/server
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

    print_status "Systemd service file created at /tmp/cardwise.service"
    print_status "To install the service, run:"
    print_status "  sudo cp /tmp/cardwise.service /etc/systemd/system/"
    print_status "  sudo systemctl daemon-reload"
    print_status "  sudo systemctl enable cardwise"
    print_status "  sudo systemctl start cardwise"
fi

print_status "Creating startup script..."
cat > start.sh << 'EOF'
#!/bin/bash

# CardWise Application Startup Script

echo "🃏 Starting CardWise Application..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   Ubuntu/Debian: sudo systemctl start mongod"
    echo "   macOS: brew services start mongodb-community"
    exit 1
fi

# Start the application
echo "🚀 Starting CardWise server and client..."

# Function to cleanup on exit
cleanup() {
    echo "🛑 Shutting down CardWise..."
    kill $SERVER_PID $CLIENT_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start server
cd server
echo "📡 Starting server on port 3000..."
node server.js &
SERVER_PID=$!

# Start client
cd ../client
echo "🌐 Starting client on port 5173..."
npm run dev &
CLIENT_PID=$!

echo ""
echo "✅ CardWise is now running!"
echo ""
echo "📊 Application URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3000"
echo ""
echo "🗄️  Database:"
echo "   MongoDB: mongodb://localhost/CardWise"
echo ""
echo "Press Ctrl+C to stop the application..."

# Wait for processes
wait $SERVER_PID $CLIENT_PID
EOF

chmod +x start.sh
print_success "Startup script created (start.sh)"

print_status "Creating stop script..."
cat > stop.sh << 'EOF'
#!/bin/bash

echo "🛑 Stopping CardWise Application..."

# Kill any running CardWise processes
pkill -f "node server.js" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

echo "✅ CardWise stopped successfully"
EOF

chmod +x stop.sh
print_success "Stop script created (stop.sh)"

print_status "Creating status check script..."
cat > status.sh << 'EOF'
#!/bin/bash

echo "📊 CardWise Application Status"
echo "================================"

# Check MongoDB
if pgrep -x "mongod" > /dev/null; then
    echo "🗄️  MongoDB: ✅ Running"
else
    echo "🗄️  MongoDB: ❌ Not running"
fi

# Check server
if pgrep -f "node server.js" > /dev/null; then
    echo "📡 Server:   ✅ Running (port 3000)"
else
    echo "📡 Server:   ❌ Not running"
fi

# Check client
if pgrep -f "npm run dev\|vite" > /dev/null; then
    echo "🌐 Client:   ✅ Running (port 5173)"
else
    echo "🌐 Client:   ❌ Not running"
fi

echo ""

# Test endpoints if server is running
if pgrep -f "node server.js" > /dev/null; then
    echo "🔍 Testing API endpoints..."
    
    if curl -s http://localhost:3000/api/cards/stats > /dev/null; then
        echo "   /api/cards/stats: ✅ Responding"
    else
        echo "   /api/cards/stats: ❌ Not responding"
    fi
    
    if curl -s http://localhost:3000/api/scan/jobs > /dev/null; then
        echo "   /api/scan/jobs:   ✅ Responding"
    else
        echo "   /api/scan/jobs:   ❌ Not responding"
    fi
fi
EOF

chmod +x status.sh
print_success "Status script created (status.sh)"

print_success "🎉 CardWise deployment completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "   1. Start the application: ./start.sh"
echo "   2. Open your browser to: http://localhost:5173"
echo "   3. Check status anytime: ./status.sh"
echo "   4. Stop the application: ./stop.sh"
echo ""
echo "🔧 Configuration:"
echo "   • Admin user: admin@cardwise.com (password: admin123)"
echo "   • Sample cards have been loaded"
echo "   • Configure API keys in Settings page"
echo ""
echo "📁 Important Directories:"
echo "   • Card images: /opt/scanimg"
echo "   • Processed images: /opt/cardimg"
echo "   • Application logs: /opt/CardWise/logs"
echo "   • Backups: /opt/CardWise/backups"
echo ""
print_warning "Remember to:"
print_warning "• Change default passwords in production"
print_warning "• Configure proper API keys for eBay/TCGPlayer"
print_warning "• Set up proper backup procedures"
print_warning "• Configure firewall rules for production deployment"