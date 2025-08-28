# CardWise Application Deployment Guide

This guide provides instructions for deploying the CardWise application using the provided deployment scripts.

## Prerequisites

Before deploying CardWise, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (running locally or accessible remotely)
- **Git** (for cloning the repository)

### Installing Prerequisites on Ubuntu/Debian:

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Installing Prerequisites on macOS:

```bash
# Install Node.js using Homebrew
brew install node

# Install MongoDB using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

## Deployment Scripts

The CardWise application comes with three deployment scripts:

1. **`deploy.sh`** - Main deployment script that sets up and starts the application
2. **`stop.sh`** - Stops all application services
3. **`status.sh`** - Checks the status of all services

## Quick Start

1. **Make scripts executable:**
   ```bash
   chmod +x deploy.sh stop.sh status.sh
   ```

2. **Deploy the application:**
   ```bash
   ./deploy.sh
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Admin login: admin@cardwise.com / admin123

## Detailed Deployment Process

### Step 1: Prepare the Environment

The deployment script will automatically:
- Check Node.js and MongoDB installations
- Install all dependencies for both client and server
- Create environment configuration files
- Set up database connections

### Step 2: Start Services

The script will:
- Start the Express.js backend server on port 3000
- Seed the database with an admin user and sample cards
- Start the React frontend development server on port 5173

### Step 3: Verify Deployment

After deployment, you can verify everything is working:

```bash
# Check service status
./status.sh

# Test API endpoints
curl http://localhost:3000/api/seed/admin
curl http://localhost:3000/api/seed/cards

# Access the web interface
open http://localhost:5173
```

## Managing the Application

### Starting the Application
```bash
./deploy.sh
```

### Stopping the Application
```bash
./stop.sh
```

### Checking Status
```bash
./status.sh
```

### Viewing Logs
```bash
# Server logs
tail -f server.log

# Client logs
tail -f client.log
```

## Configuration

### Environment Variables

The deployment script creates a `server/.env` file with default values:

```env
PORT=3000
DATABASE_URL=mongodb://localhost/CardWise
JWT_SECRET=your-jwt-secret-key-here
REFRESH_TOKEN_SECRET=your-refresh-token-secret-here
```

**Important:** For production deployments, update the JWT secrets with secure, randomly generated values.

### Database Configuration

By default, the application connects to a local MongoDB instance. To use a remote MongoDB instance:

1. Update the `DATABASE_URL` in `server/.env`
2. Ensure the MongoDB instance is accessible
3. Restart the application

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill processes on ports 3000 and 5173
   sudo lsof -ti:3000 | xargs kill -9
   sudo lsof -ti:5173 | xargs kill -9
   ```

2. **MongoDB Connection Failed**
   ```bash
   # Start MongoDB service
   sudo systemctl start mongod
   
   # Check MongoDB status
   sudo systemctl status mongod
   ```

3. **Permission Denied on Scripts**
   ```bash
   chmod +x deploy.sh stop.sh status.sh
   ```

4. **Node.js Version Issues**
   ```bash
   # Check Node.js version
   node --version
   
   # Update Node.js if needed
   npm install -g n
   sudo n stable
   ```

### Log Analysis

Check the log files for detailed error information:

```bash
# Recent server errors
tail -n 50 server.log | grep -i error

# Recent client errors  
tail -n 50 client.log | grep -i error
```

## Production Deployment

For production deployments, consider:

1. **Use a process manager** like PM2:
   ```bash
   npm install -g pm2
   pm2 start server/server.js --name cardwise-server
   pm2 start "npm run dev" --name cardwise-client --cwd client
   ```

2. **Set up a reverse proxy** with Nginx
3. **Use environment-specific configuration files**
4. **Set up SSL certificates** for HTTPS
5. **Configure database backups**
6. **Set up monitoring and logging**

## Support

If you encounter issues during deployment:

1. Check the troubleshooting section above
2. Review the log files for error messages
3. Ensure all prerequisites are properly installed
4. Verify MongoDB is running and accessible

For additional support, please check the application documentation or contact the development team.