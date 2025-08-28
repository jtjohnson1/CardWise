// Load environment variables from parent directory
require("dotenv").config({ path: '../.env' });
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const basicRoutes = require("./routes/index");
const seedRoutes = require("./routes/seedRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const cardRoutes = require("./routes/cardRoutes");
const scanRoutes = require("./routes/scanRoutes");
const { connectDB } = require("./config/database");
const { seedAdminUser, seedSampleCards } = require("./services/seedService");
const cors = require("cors");

console.log('[ENV] Loading environment variables...');
console.log('[ENV] DATABASE_URL:', process.env.DATABASE_URL);
console.log('[ENV] OLLAMA_HOST:', process.env.OLLAMA_HOST);
console.log('[ENV] PORT:', process.env.PORT);

if (!process.env.DATABASE_URL) {
  console.error("Error: DATABASE_URL variables in .env missing.");
  process.exit(-1);
}

const app = express();
const port = process.env.PORT || 3000;
// Pretty-print JSON responses
app.enable('json spaces');
// We want to be consistent with URL paths, so we enable strict routing
app.enable('strict routing');

app.use(cors({}));

// Custom JSON parser with better error handling
app.use('/api', (req, res, next) => {
  console.log(`[PERFORMANCE] ${req.method} ${req.url} - Processing request`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('[PERFORMANCE] Request body:', JSON.stringify(req.body));
    console.log('[PERFORMANCE] Request headers:', JSON.stringify(req.headers));
  }
  next();
});

app.use(express.json({
  limit: '10mb',
  verify: (req, res, buf, encoding) => {
    try {
      if (buf && buf.length > 0) {
        const bodyString = buf.toString(encoding || 'utf8');
        console.log('[PERFORMANCE] Raw request body:', bodyString);
        JSON.parse(bodyString);
      }
    } catch (error) {
      console.error('[PERFORMANCE] JSON parsing error:', error.message);
      console.error('[PERFORMANCE] Invalid JSON body:', buf.toString(encoding || 'utf8'));
      throw new Error('Invalid JSON in request body');
    }
  }
}));

app.use(express.urlencoded({ extended: true }));

// Database connection and initialization
const initializeDatabase = async () => {
  try {
    console.log('[PERFORMANCE] Starting database initialization...');
    const startTime = Date.now();

    await connectDB();
    console.log(`[PERFORMANCE] Database connection took ${Date.now() - startTime}ms`);

    // Make seeding non-fatal - don't crash server if it fails
    console.log('[PERFORMANCE] Starting admin user seeding...');
    const adminStartTime = Date.now();
    try {
      const adminResult = await seedAdminUser();
      console.log(`[PERFORMANCE] Admin user seeding took ${Date.now() - adminStartTime}ms`);
      console.log('Admin user check result:', adminResult.message);
    } catch (error) {
      console.error('[PERFORMANCE] Admin user seeding failed (non-fatal):', error.message);
      console.log('[PERFORMANCE] Server will continue without seeding admin user');
    }

    console.log('[PERFORMANCE] Starting sample cards seeding...');
    const cardsStartTime = Date.now();
    try {
      const cardsResult = await seedSampleCards();
      console.log(`[PERFORMANCE] Sample cards seeding took ${Date.now() - cardsStartTime}ms`);
      console.log('Sample cards check result:', cardsResult.message);
    } catch (error) {
      console.error('[PERFORMANCE] Sample cards seeding failed (non-fatal):', error.message);
      console.log('[PERFORMANCE] Server will continue without seeding sample cards');
    }

    console.log(`[PERFORMANCE] Total database initialization took ${Date.now() - startTime}ms`);

  } catch (error) {
    console.error('[PERFORMANCE] Database connection error:', error.message);
    console.error('[PERFORMANCE] Error stack:', error.stack);
    process.exit(1);
  }
};

// Initialize database
console.log('[PERFORMANCE] Starting server initialization...');
const serverStartTime = Date.now();
initializeDatabase();

app.on("error", (error) => {
  console.error(`[PERFORMANCE] Server error: ${error.message}`);
  console.error(error.stack);
});

// Routes - Add logging for route registration
console.log('[PERFORMANCE] Registering routes...');
console.log('[PERFORMANCE] Registering basicRoutes...');
app.use(basicRoutes);

console.log('[PERFORMANCE] Registering seedRoutes...');
app.use(seedRoutes);

console.log('[PERFORMANCE] Registering settingsRoutes...');
app.use(settingsRoutes);

console.log('[PERFORMANCE] Registering cardRoutes...');
app.use(cardRoutes);

console.log('[PERFORMANCE] Registering scanRoutes...');
console.log('[PERFORMANCE] scanRoutes module type:', typeof scanRoutes);
console.log('[PERFORMANCE] scanRoutes module:', scanRoutes);
app.use(scanRoutes);

console.log('[PERFORMANCE] All routes registered');

// Add middleware to log all incoming requests
app.use('*', (req, res, next) => {
  console.log(`[PERFORMANCE] Unmatched request: ${req.method} ${req.originalUrl}`);
  next();
});

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  console.log(`[PERFORMANCE] 404 request: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    error: "Endpoint not found"
  });
});

// Error handling - ensure JSON responses
app.use((err, req, res, next) => {
  console.error(`[PERFORMANCE] Unhandled application error: ${err.message}`);
  console.error('[PERFORMANCE] Error stack:', err.stack);
  console.error('[PERFORMANCE] Request URL:', req.url);
  console.error('[PERFORMANCE] Request method:', req.method);
  console.error('[PERFORMANCE] Request headers:', JSON.stringify(req.headers));

  // Always return JSON error responses for API endpoints
  if (req.url.startsWith('/api/')) {
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error"
    });
  } else {
    res.status(500).send("There was an error serving your request.");
  }
});

app.listen(port, () => {
  console.log(`[PERFORMANCE] Server startup completed in ${Date.now() - serverStartTime}ms`);
  console.log(`Server running at http://localhost:${port}`);
});