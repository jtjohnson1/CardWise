# CardWise

CardWise is a locally-running digital card management application that allows users to organize, track, and manage their sports card collections. The app leverages AI-powered image processing to automatically identify and catalog cards from scanned images, providing comprehensive collection management with real-time market pricing.

## Features

- **AI-Powered Card Scanning**: Automatically identify and catalog cards using Ollama AI
- **Collection Management**: Organize, search, and filter your card collection
- **Real-time Pricing**: Integration with eBay and TCGPlayer APIs for market pricing
- **Wishlist Management**: Track cards you want to acquire
- **Trade Lists**: Manage cards available for trading
- **Analytics Dashboard**: Insights into your collection's value and trends
- **Local Database**: All data stored locally using MongoDB

## Prerequisites

Before running CardWise, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **MongoDB** (running locally on port 27017)
- **Ollama** (optional, for AI card scanning)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CardWise
```

2. Install all dependencies:
```bash
npm run install-all
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start MongoDB:
```bash
# On Ubuntu/Debian:
sudo systemctl start mongod

# On macOS with Homebrew:
brew services start mongodb-community

# Or run directly:
mongod
```

5. (Optional) Start Ollama for AI scanning:
```bash
ollama serve
ollama pull llava:latest
```

## Usage

### Development Mode

Start both client and server in development mode:

```bash
npm start
```

This will start:
- Client (React + Vite) on http://localhost:5173
- Server (Express + MongoDB) on http://localhost:3000

### Individual Services

Start only the client:
```bash
npm run client
```

Start only the server:
```bash
npm run server
```

### Building for Production

Build the client for production:
```bash
npm run build
```

## API Endpoints

### Seeding Data

Seed the database with initial admin user:
```bash
curl -X POST http://localhost:3000/api/seed/admin
```

Seed the database with sample cards:
```bash
curl -X POST http://localhost:3000/api/seed/cards
```

### Cards Management

- `GET /api/cards` - Get all cards
- `GET /api/cards/stats` - Get collection statistics
- `GET /api/cards/:id` - Get specific card
- `POST /api/cards` - Create new card
- `PUT /api/cards/:id` - Update card
- `DELETE /api/cards/:id` - Delete card

### Scanning

- `POST /api/scan/start` - Start new scan job
- `GET /api/scan/jobs` - Get all scan jobs
- `GET /api/scan/progress/:jobId` - Get scan progress
- `POST /api/scan/pause/:jobId` - Pause scan job
- `POST /api/scan/resume/:jobId` - Resume scan job

### Settings

- `GET/POST /api/settings/ebay` - eBay API configuration
- `GET/POST /api/settings/tcgplayer` - TCGPlayer API configuration
- `GET/POST /api/settings/notifications` - Notification preferences
- `GET/POST /api/settings/scanning` - Scanning preferences

## Configuration

### Database

CardWise uses MongoDB with the database name `CardWise`. The connection string is configured in the `.env` file:

```
DATABASE_URL=mongodb://localhost:27017/CardWise
```

### AI Scanning

For AI-powered card scanning, configure Ollama:

```
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llava:latest
```

### API Integrations

Configure eBay and TCGPlayer API credentials in the application settings or environment variables.

## Troubleshooting

### MongoDB Connection Issues

1. Ensure MongoDB is running:
```bash
sudo systemctl status mongod
```

2. Check if the database exists:
```bash
mongosh --eval 'show dbs'
```

3. Create the database if needed:
```bash
mongosh --eval 'use CardWise; db.createCollection("users")'
```

### Ollama Issues

1. Check if Ollama is running:
```bash
curl http://localhost:11434/api/tags
```

2. Install the required model:
```bash
ollama pull llava:latest
```

### Port Conflicts

If ports 3000 or 5173 are in use, update the configuration:
- Server port: Change `PORT` in `.env`
- Client port: Update `vite.config.ts`

## Development

### Project Structure

```
CardWise/
├── client/          # React frontend
├── server/          # Express backend
├── scripts/         # Build and deployment scripts
├── package.json     # Root package configuration
└── README.md        # This file
```

### Adding New Features

1. Backend changes go in `server/`
2. Frontend changes go in `client/`
3. API endpoints should be added to `server/routes/`
4. Database models go in `server/models/`

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions, please check the troubleshooting section or create an issue in the repository.