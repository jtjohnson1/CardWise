#!/bin/bash

# CardWise Application Status Script
# This script checks the status of CardWise application services

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "CardWise Application Status"
echo "=========================="

# Check server status
print_status "Checking server status..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    print_success "Server is running on http://localhost:3000"
    if [ -f "server.pid" ]; then
        SERVER_PID=$(cat server.pid)
        echo "  PID: $SERVER_PID"
    fi
else
    print_error "Server is not responding on http://localhost:3000"
fi

# Check client status
print_status "Checking client status..."
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    print_success "Client is running on http://localhost:5173"
    if [ -f "client.pid" ]; then
        CLIENT_PID=$(cat client.pid)
        echo "  PID: $CLIENT_PID"
    fi
else
    print_error "Client is not responding on http://localhost:5173"
fi

# Check MongoDB status
print_status "Checking MongoDB status..."
if command -v mongosh &> /dev/null; then
    MONGO_CMD="mongosh"
elif command -v mongo &> /dev/null; then
    MONGO_CMD="mongo"
else
    print_error "MongoDB client not found"
    exit 1
fi

if $MONGO_CMD --eval "db.runCommand('ping')" --quiet > /dev/null 2>&1; then
    print_success "MongoDB is running and accessible"
    
    # Check if admin user exists
    ADMIN_COUNT=$($MONGO_CMD CardWise --eval "db.users.countDocuments({email: 'admin@cardwise.com'})" --quiet 2>/dev/null | tail -1)
    if [ "$ADMIN_COUNT" = "1" ]; then
        print_success "Admin user exists in database"
    else
        print_error "Admin user not found in database"
    fi
    
    # Check card count
    CARD_COUNT=$($MONGO_CMD CardWise --eval "db.cards.countDocuments({})" --quiet 2>/dev/null | tail -1)
    if [ "$CARD_COUNT" -gt "0" ]; then
        print_success "Database contains $CARD_COUNT cards"
    else
        print_error "No cards found in database"
    fi
else
    print_error "Cannot connect to MongoDB"
fi

echo ""
echo "Log files:"
if [ -f "server.log" ]; then
    echo "  • Server log: ./server.log ($(wc -l < server.log) lines)"
else
    echo "  • Server log: Not found"
fi

if [ -f "client.log" ]; then
    echo "  • Client log: ./client.log ($(wc -l < client.log) lines)"
else
    echo "  • Client log: Not found"
fi