# CardWise - Digital Card Collection Management

CardWise is a locally-running digital card management application that allows users to organize, track, and manage their sports card collections with AI-powered image processing and real-time market pricing.

## Features

- **Digital Card Management**: Organize and catalog your sports card collection
- **AI-Powered Scanning**: Automatic card identification from scanned images
- **Market Pricing**: Real-time pricing data integration
- **Collection Analytics**: Detailed insights and statistics
- **Trade Management**: Wishlist and trade list functionality
- **Local Storage**: All data stored locally with MongoDB

## Prerequisites

- Node.js 16 or higher
- MongoDB 4.4 or higher
- Git

## Quick Start

### Development Mode (with mock data)

```bash
# Clone the repository
git clone <repository-url>
cd CardWise

# Install dependencies
npm install

# Start in development mode
npm start
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

### Production Mode (with real API calls)

```bash
# Deploy in production mode
chmod +x deploy.sh
./deploy.sh
```

This will:
- Install all dependencies
- Configure production environment
- Enable real API calls (disable mock data)
- Build and start the application
- Create log files for monitoring

### Managing the Application

#### Check Status
```bash
./status.sh
```

#### Stop the Application
```bash
./stop.sh
```

#### View Logs
```bash
# Server logs
tail -f server.log

# Client logs
tail -f client.log
```

## Project Structure

```
CardWise/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API integration layer
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── hooks/         # Custom hooks
│   └── dist/              # Built frontend (production)
├── server/                # Express backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   └── utils/            # Utility functions
├── deploy.sh             # Production deployment script
├── status.sh             # Status check script
└── stop.sh               # Stop application script
```

## API Endpoints

### Cards
- `GET /api/cards` - Get all cards
- `GET /api/cards/:id` - Get single card
- `POST /api/cards` - Create new card
- `PUT /api/cards/:id` - Update card
- `DELETE /api/cards/:id` - Delete card
- `GET /api/cards/stats` - Get collection statistics

### Scanning
- `POST /api/scan/start` - Start scan job
- `GET /api/scan/jobs` - Get scan jobs
- `GET /api/scan/progress/:jobId` - Get scan progress
- `POST /api/scan/pause/:jobId` - Pause scan job
- `POST /api/scan/resume/:jobId` - Resume scan job

### Settings
- `GET/POST /api/settings/ebay` - eBay API configuration
- `GET/POST /api/settings/tcgplayer` - TCGPlayer API configuration
- `GET/POST /api/settings/notifications` - Notification preferences
- `GET/POST /api/settings/scanning` - Scanning preferences

### Database Seeding
- `POST /api/seed/admin` - Create admin user
- `POST /api/seed/cards` - Create sample cards

## Environment Configuration

Create `server/.env` with:

```env
PORT=3000
DATABASE_URL=mongodb://localhost/CardWise
JWT_SECRET=your-jwt-secret
REFRESH_TOKEN_SECRET=your-refresh-secret
NODE_ENV=production
```

## Development vs Production

### Development Mode
- Uses mock data for API responses
- Hot reloading enabled
- Detailed error messages
- Development server (Vite)

### Production Mode
- Real API calls to backend
- Optimized build
- Production error handling
- Static file serving

## Database Schema

### User Model
```javascript
{
  email: String,
  password: String (hashed),
  firstName: String,
  lastName: String,
  role: String (admin/user),
  preferences: Object
}
```

### Card Model
```javascript
{
  playerName: String,
  sport: String,
  year: Number,
  manufacturer: String,
  setName: String,
  cardNumber: String,
  frontImage: String,
  backImage: String,
  condition: Object,
  estimatedValue: Number,
  tags: [String],
  userId: ObjectId
}
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   ```bash
   # Start MongoDB
   sudo systemctl start mongod
   # or on macOS
   brew services start mongodb-community
   ```

2. **Port Already in Use**
   ```bash
   # Kill processes on ports 3000 and 5173
   ./stop.sh
   ```

3. **Dependencies Issues**
   ```bash
   # Clean install
   rm -rf node_modules client/node_modules server/node_modules
   npm install
   ```

4. **API Calls Not Working**
   - Ensure you're running in production mode: `./deploy.sh`
   - Check server logs: `tail -f server.log`
   - Verify backend is running: `curl http://localhost:3000/api/seed/admin`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test in both development and production modes
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the logs: `server.log` and `client.log`
- Run status check: `./status.sh`
- Review API documentation above
- Check MongoDB connection and status