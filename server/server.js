// Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const basicRoutes = require("./routes/index");
const seedRoutes = require("./routes/seedRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const cardRoutes = require("./routes/cardRoutes");
const { connectDB } = require("./config/database");
const { seedAdminUser, seedSampleCards } = require("./services/seedService");
const cors = require("cors");

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection and initialization
const initializeDatabase = async () => {
  try {
    console.log('[PERFORMANCE] Starting database initialization...');
    const startTime = Date.now();
    
    await connectDB();
    console.log(`[PERFORMANCE] Database connection took ${Date.now() - startTime}ms`);

    console.log('[PERFORMANCE] Starting admin user seeding...');
    const adminStartTime = Date.now();
    // Automatically seed admin user if it doesn't exist
    const adminResult = await seedAdminUser();
    console.log(`[PERFORMANCE] Admin user seeding took ${Date.now() - adminStartTime}ms`);
    console.log('Admin user check result:', adminResult.message);

    console.log('[PERFORMANCE] Starting sample cards seeding...');
    const cardsStartTime = Date.now();
    // Automatically seed sample cards if they don't exist
    const cardsResult = await seedSampleCards();
    console.log(`[PERFORMANCE] Sample cards seeding took ${Date.now() - cardsStartTime}ms`);
    console.log('Sample cards check result:', cardsResult.message);

    console.log(`[PERFORMANCE] Total database initialization took ${Date.now() - startTime}ms`);

  } catch (error) {
    console.error('[PERFORMANCE] Database initialization error:', error.message);
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

// Routes
app.use(basicRoutes);
app.use(seedRoutes);
app.use(settingsRoutes);
app.use(cardRoutes);

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  console.log(`[PERFORMANCE] 404 request: ${req.method} ${req.url}`);
  res.status(404).send("Page not found.");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`[PERFORMANCE] Unhandled application error: ${err.message}`);
  console.error(err.stack);
  res.status(500).send("There was an error serving your request.");
});

app.listen(port, () => {
  console.log(`[PERFORMANCE] Server startup completed in ${Date.now() - serverStartTime}ms`);
  console.log(`Server running at http://localhost:${port}`);
});