const express = require('express');
const Card = require('../models/Card');
const User = require('../models/User');

const router = express.Router();

/**
 * GET /api/cards/stats
 * Get collection statistics
 * NOTE: This route must come BEFORE /api/cards/:id to avoid route conflicts
 */
router.get('/api/cards/stats', async (req, res) => {
  try {
    console.log('GET /api/cards/stats - Fetching collection statistics');
    
    // For now, get admin user's cards since we don't have authentication
    const adminUser = await User.findOne({ email: 'admin@cardwise.com' });
    if (!adminUser) {
      return res.status(404).json({
        success: false,
        error: 'Admin user not found'
      });
    }

    const totalCards = await Card.countDocuments({ userId: adminUser._id });
    const totalValue = await Card.aggregate([
      { $match: { userId: adminUser._id } },
      { $group: { _id: null, total: { $sum: '$estimatedValue' } } }
    ]);

    const recentCards = await Card.find({ userId: adminUser._id })
      .sort({ createdAt: -1 })
      .limit(5);

    const sportBreakdown = await Card.aggregate([
      { $match: { userId: adminUser._id } },
      { $group: { _id: '$sport', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log(`Collection stats: ${totalCards} cards, $${totalValue[0]?.total || 0} total value`);

    res.status(200).json({
      success: true,
      stats: {
        totalCards,
        totalValue: totalValue[0]?.total || 0,
        recentCards,
        sportBreakdown
      }
    });
  } catch (error) {
    console.error('Error fetching collection statistics:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch collection statistics'
    });
  }
});

/**
 * GET /api/cards
 * Get all cards for the current user
 */
router.get('/api/cards', async (req, res) => {
  try {
    console.log('GET /api/cards - Fetching all cards');
    
    // For now, get admin user's cards since we don't have authentication
    const adminUser = await User.findOne({ email: 'admin@cardwise.com' });
    if (!adminUser) {
      return res.status(404).json({
        success: false,
        error: 'Admin user not found'
      });
    }

    const cards = await Card.find({ userId: adminUser._id }).sort({ createdAt: -1 });
    console.log(`Found ${cards.length} cards for user`);

    res.status(200).json({
      success: true,
      cards: cards
    });
  } catch (error) {
    console.error('Error fetching cards:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cards'
    });
  }
});

/**
 * GET /api/cards/:id
 * Get a specific card by ID
 * NOTE: This route must come AFTER specific routes like /api/cards/stats
 */
router.get('/api/cards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`GET /api/cards/${id} - Fetching card details`);

    const card = await Card.findById(id);
    if (!card) {
      return res.status(404).json({
        success: false,
        error: 'Card not found'
      });
    }

    console.log(`Found card: ${card.playerName}`);
    res.status(200).json({
      success: true,
      card: card
    });
  } catch (error) {
    console.error('Error fetching card:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch card'
    });
  }
});

/**
 * POST /api/cards
 * Create a new card
 */
router.post('/api/cards', async (req, res) => {
  try {
    console.log('POST /api/cards - Creating new card');
    
    // For now, use admin user since we don't have authentication
    const adminUser = await User.findOne({ email: 'admin@cardwise.com' });
    if (!adminUser) {
      return res.status(404).json({
        success: false,
        error: 'Admin user not found'
      });
    }

    const cardData = {
      ...req.body,
      userId: adminUser._id
    };

    const card = new Card(cardData);
    const savedCard = await card.save();

    console.log(`Created new card: ${savedCard.playerName}`);
    res.status(201).json({
      success: true,
      message: 'Card created successfully',
      card: savedCard
    });
  } catch (error) {
    console.error('Error creating card:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to create card'
    });
  }
});

/**
 * PUT /api/cards/:id
 * Update a card
 */
router.put('/api/cards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`PUT /api/cards/${id} - Updating card`);

    const card = await Card.findByIdAndUpdate(id, req.body, { new: true });
    if (!card) {
      return res.status(404).json({
        success: false,
        error: 'Card not found'
      });
    }

    console.log(`Updated card: ${card.playerName}`);
    res.status(200).json({
      success: true,
      message: 'Card updated successfully',
      card: card
    });
  } catch (error) {
    console.error('Error updating card:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to update card'
    });
  }
});

/**
 * DELETE /api/cards/:id
 * Delete a card
 */
router.delete('/api/cards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`DELETE /api/cards/${id} - Deleting card`);

    const card = await Card.findByIdAndDelete(id);
    if (!card) {
      return res.status(404).json({
        success: false,
        error: 'Card not found'
      });
    }

    console.log(`Deleted card: ${card.playerName}`);
    res.status(200).json({
      success: true,
      message: 'Card deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting card:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to delete card'
    });
  }
});

module.exports = router;