#!/bin/bash

# CardWise Application Stop Script
# This script stops all CardWise application services

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

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_status "Stopping CardWise Application..."

# Stop server
if [ -f "server.pid" ]; then
    SERVER_PID=$(cat server.pid)
    if kill -0 $SERVER_PID 2>/dev/null; then
        print_status "Stopping server (PID: $SERVER_PID)..."
        kill $SERVER_PID
        sleep 2
        if kill -0 $SERVER_PID 2>/dev/null; then
            print_warning "Server didn't stop gracefully, forcing shutdown..."
            kill -9 $SERVER_PID
        fi
        print_success "Server stopped"
    else
        print_warning "Server process not running"
    fi
    rm server.pid
else
    print_warning "Server PID file not found"
    # Try to kill any process on port 3000
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_status "Found process on port 3000, stopping..."
        kill -9 $(lsof -Pi :3000 -sTCP:LISTEN -t) 2>/dev/null || true
    fi
fi

# Stop client
if [ -f "client.pid" ]; then
    CLIENT_PID=$(cat client.pid)
    if kill -0 $CLIENT_PID 2>/dev/null; then
        print_status "Stopping client (PID: $CLIENT_PID)..."
        kill $CLIENT_PID
        sleep 2
        if kill -0 $CLIENT_PID 2>/dev/null; then
            print_warning "Client didn't stop gracefully, forcing shutdown..."
            kill -9 $CLIENT_PID
        fi
        print_success "Client stopped"
    else
        print_warning "Client process not running"
    fi
    rm client.pid
else
    print_warning "Client PID file not found"
    # Try to kill any process on port 5173
    if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_status "Found process on port 5173, stopping..."
        kill -9 $(lsof -Pi :5173 -sTCP:LISTEN -t) 2>/dev/null || true
    fi
fi

print_success "CardWise Application stopped successfully"