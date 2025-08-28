const express = require('express');
const { seedAdminUser, seedSampleCards } = require('../services/seedService');

const router = express.Router();

/**
 * POST /api/seed/admin
 * Seed the database with an initial admin user
 */
router.post('/api/seed/admin', async (req, res) => {
  try {
    console.log('Received request to seed admin user');
    const result = await seedAdminUser();
    
    console.log('Admin user seeding completed successfully');
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in admin seeding endpoint:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/seed/cards
 * Seed the database with sample card data
 */
router.post('/api/seed/cards', async (req, res) => {
  try {
    console.log('Received request to seed sample cards');
    const result = await seedSampleCards();
    
    console.log('Sample cards seeding completed successfully');
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in cards seeding endpoint:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;