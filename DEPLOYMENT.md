# CardWise Deployment Guide

This guide provides step-by-step instructions for deploying CardWise, a digital card collection management application.

## Prerequisites

Before deploying CardWise, ensure your system meets the following requirements:

### System Requirements
- **Operating System**: Ubuntu 20.04+ or similar Linux distribution
- **Node.js**: Version 16.0 or higher
- **npm**: Version 8.0 or higher
- **MongoDB**: Version 5.0 or higher
- **Memory**: Minimum 2GB RAM (4GB recommended)
- **Storage**: Minimum 10GB free space

### Optional Components
- **Ollama**: For AI-powered card scanning functionality
- **NVIDIA GPU**: For accelerated AI processing (if using Ollama)

## Quick Deployment Script

For a quick deployment, you can use the following bash script:

```bash
#!/bin/bash

# CardWise Deployment Script
set -e

echo "Starting CardWise deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

# Update system packages
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    print_status "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    print_status "Node.js already installed: $(node --version)"
fi

# Install MongoDB if not present
if ! command -v mongod &> /dev/null; then
    print_status "Installing MongoDB..."
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
    sudo apt-get update
    sudo apt-get install -y mongodb-org
    sudo systemctl start mongod
    sudo systemctl enable mongod
else
    print_status "MongoDB already installed"
    sudo systemctl start mongod
fi

# Create application directory
INSTALL_DIR="/opt/CardWise"
if [ ! -d "$INSTALL_DIR" ]; then
    print_status "Creating application directory..."
    sudo mkdir -p $INSTALL_DIR
    sudo chown $USER:$USER $INSTALL_DIR
fi

cd $INSTALL_DIR

# Install dependencies
print_status "Installing application dependencies..."
if [ -f "package.json" ]; then
    npm install
    
    # Install client dependencies
    if [ -d "client" ]; then
        cd client
        npm install
        cd ..
    fi
    
    # Install server dependencies
    if [ -d "server" ]; then
        cd server
        npm install
        cd ..
    fi
else
    print_error "package.json not found in $INSTALL_DIR"
    exit 1
fi

# Setup environment configuration
print_status "Setting up environment configuration..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_warning "Please edit .env file with your configuration"
    else
        # Create basic .env file
        cat > .env << EOF
# Database
DATABASE_URL=mongodb://localhost:27017/CardWise

# Server
PORT=3000
NODE_ENV=production

# Security (CHANGE THESE VALUES)
JWT_SECRET=your-secure-jwt-secret-here
REFRESH_TOKEN_SECRET=your-secure-refresh-secret-here
SESSION_SECRET=your-secure-session-secret-here

# Ollama (optional)
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llava:latest
EOF
        print_warning "Created .env file with default values. Please update with secure values!"
    fi
fi

# Build client application
print_status "Building client application..."
if [ -d "client" ]; then
    cd client
    npm run build
    cd ..
fi

# Install PM2 for process management
if ! command -v pm2 &> /dev/null; then
    print_status "Installing PM2..."
    sudo npm install -g pm2
fi

# Create PM2 ecosystem file
print_status "Creating PM2 configuration..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'cardwise-server',
      script: 'server/server.js',
      cwd: '$INSTALL_DIR',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};
EOF

# Start application with PM2
print_status "Starting CardWise application..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Verify MongoDB is running
print_status "Verifying MongoDB connection..."
if mongosh --eval 'db.runCommand("connectionStatus")' > /dev/null 2>&1; then
    print_status "MongoDB is running successfully"
else
    print_error "MongoDB connection failed"
    exit 1
fi

# Test application
print_status "Testing application..."
sleep 5
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_status "CardWise is running successfully!"
    print_status "Access your application at: http://localhost:3000"
else
    print_warning "Application may still be starting up. Check with: pm2 logs cardwise-server"
fi

print_status "Deployment completed!"
print_warning "Don't forget to:"
print_warning "1. Update .env file with secure values"
print_warning "2. Configure firewall settings"
print_warning "3. Set up SSL certificates for production"
print_warning "4. Create admin user and seed database"

echo ""
print_status "Useful commands:"
echo "  pm2 status                 - Check application status"
echo "  pm2 logs cardwise-server   - View application logs"
echo "  pm2 restart cardwise-server - Restart application"
echo "  pm2 stop cardwise-server   - Stop application"
```

Save this script as `deploy-cardwise.sh` and run it with:
```bash
chmod +x deploy-cardwise.sh
./deploy-cardwise.sh
```

## Installation Steps

### 1. System Preparation

Update your system packages:
```bash
sudo apt update && sudo apt upgrade -y
```

Install Node.js and npm:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify installation:
```bash
node --version  # Should be v16.0 or higher
npm --version   # Should be v8.0 or higher
```

### 2. MongoDB Installation

Install MongoDB:
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

Start and enable MongoDB:
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

Verify MongoDB is running:
```bash
sudo systemctl status mongod
mongosh --eval 'db.runCommand("connectionStatus")'
```

### 3. CardWise Application Setup

Clone or extract the CardWise application:
```bash
cd /opt
sudo mkdir CardWise
sudo chown $USER:$USER CardWise
cd CardWise
# Extract your CardWise files here
```

Install dependencies:
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..

# Install server dependencies
cd server
npm install
cd ..
```

### 4. Environment Configuration

Create environment file:
```bash
cp .env.example .env
```

Edit the environment file:
```bash
nano .env
```

Configure the following variables:
```env
# Database
DATABASE_URL=mongodb://localhost:27017/CardWise

# Server
PORT=3000
NODE_ENV=production

# Security (generate secure values)
JWT_SECRET=your-secure-jwt-secret-here
REFRESH_TOKEN_SECRET=your-secure-refresh-secret-here
SESSION_SECRET=your-secure-session-secret-here

# Ollama (optional)
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llava:latest
```

### 5. Database Initialization

Start the server temporarily to initialize the database:
```bash
cd server
npm start &
SERVER_PID=$!
```

Seed the database:
```bash
# Create admin user
curl -X POST http://localhost:3000/api/seed/admin

# Create sample cards
curl -X POST http://localhost:3000/api/seed/cards
```

Stop the temporary server:
```bash
kill $SERVER_PID
```

### 6. Optional: Ollama Setup

If you want AI-powered card scanning, install Ollama:

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Start Ollama service
sudo systemctl start ollama
sudo systemctl enable ollama

# Pull the required model
ollama pull llava:latest
```

### 7. Production Deployment

#### Option A: Using PM2 (Recommended)

Install PM2:
```bash
sudo npm install -g pm2
```

Create PM2 ecosystem file:
```bash
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'cardwise-server',
      script: 'server/server.js',
      cwd: '/opt/CardWise',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};
EOF
```

Build the client:
```bash
cd client
npm run build
cd ..
```

Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Option B: Using systemd

Create systemd service file:
```bash
sudo cat > /etc/systemd/system/cardwise.service << EOF
[Unit]
Description=CardWise Application
After=network.target mongod.service

[Service]
Type=simple
User=$USER
WorkingDirectory=/opt/CardWise
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable cardwise
sudo systemctl start cardwise
```

### 8. Reverse Proxy Setup (Optional)

If you want to serve the application on port 80/443, set up Nginx:

Install Nginx:
```bash
sudo apt install nginx -y
```

Create Nginx configuration:
```bash
sudo cat > /etc/nginx/sites-available/cardwise << EOF
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain

    # Serve static files
    location / {
        root /opt/CardWise/client/dist;
        try_files \$uri \$uri/ /index.html;
    }

    # Proxy API requests
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/cardwise /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Verification

### 1. Check Services

Verify all services are running:
```bash
# MongoDB
sudo systemctl status mongod

# CardWise (if using systemd)
sudo systemctl status cardwise

# CardWise (if using PM2)
pm2 status

# Nginx (if configured)
sudo systemctl status nginx
```

### 2. Test API Endpoints

Test the application:
```bash
# Health check
curl http://localhost:3000/

# Get collection stats
curl http://localhost:3000/api/cards/stats

# Check admin user
mongosh --eval 'use CardWise; db.users.findOne({email: "admin@cardwise.com"})'
```

### 3. Access Application

- **Direct access**: http://localhost:3000 (if no reverse proxy)
- **With Nginx**: http://your-domain.com
- **Client development**: http://localhost:5173 (if running in dev mode)

## Maintenance

### Backup Database

Create regular backups:
```bash
# Create backup
mongodump --db CardWise --out /backup/cardwise-$(date +%Y%m%d)

# Restore backup
mongorestore --db CardWise /backup/cardwise-20231201/CardWise
```

### Update Application

To update CardWise:
```bash
cd /opt/CardWise

# Stop services
pm2 stop cardwise-server  # or sudo systemctl stop cardwise

# Update code
git pull  # or extract new version

# Update dependencies
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..

# Rebuild client
cd client && npm run build && cd ..

# Restart services
pm2 start cardwise-server  # or sudo systemctl start cardwise
```

### Monitor Logs

View application logs:
```bash
# PM2 logs
pm2 logs cardwise-server

# systemd logs
sudo journalctl -u cardwise -f

# MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

## Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   sudo lsof -i :3000
   sudo kill -9 <PID>
   ```

2. **MongoDB connection failed**:
   ```bash
   sudo systemctl restart mongod
   mongosh --eval 'db.runCommand("ping")'
   ```

3. **Permission issues**:
   ```bash
   sudo chown -R $USER:$USER /opt/CardWise
   ```

4. **Node.js version issues**:
   ```bash
   node --version
   # Update Node.js if version is below 16.0
   ```

### Performance Optimization

1. **Enable MongoDB indexing**:
   ```bash
   mongosh CardWise --eval 'db.cards.createIndex({playerName: 1, sport: 1})'
   ```

2. **Configure PM2 clustering**:
   ```javascript
   // In ecosystem.config.js
   instances: 'max'  // Use all CPU cores
   ```

3. **Enable Nginx gzip compression**:
   ```nginx
   gzip on;
   gzip_types text/plain application/json application/javascript text/css;
   ```

## Security Considerations

1. **Change default credentials**:
   - Update admin password after first login
   - Generate secure JWT secrets

2. **Configure firewall**:
   ```bash
   sudo ufw allow 22    # SSH
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS
   sudo ufw enable
   ```

3. **Enable MongoDB authentication** (for production):
   ```bash
   mongosh --eval 'use admin; db.createUser({user:"admin", pwd:"securepassword", roles:["userAdminAnyDatabase"]})'
   ```

4. **Use HTTPS in production**:
   - Configure SSL certificates with Let's Encrypt
   - Update Nginx configuration for HTTPS

For additional support or issues, refer to the main README.md file or create an issue in the project repository.