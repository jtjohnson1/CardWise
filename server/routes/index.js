const express = require('express');
const router = express.Router();

// Home route
router.get('/', (req, res) => {
  res.json({ message: 'CardWise API Server is running!' });
});

// Placeholder image route for development
router.get('/api/placeholder/:width/:height', (req, res) => {
  const { width, height } = req.params;
  const color = req.query.color || '4A90E2';
  const textColor = req.query.textColor || 'FFFFFF';
  const text = req.query.text || 'Card Image';
  
  // Redirect to via.placeholder.com for now
  const placeholderUrl = `https://via.placeholder.com/${width}x${height}/${color}/${textColor}?text=${encodeURIComponent(text)}`;
  res.redirect(placeholderUrl);
});

module.exports = router;