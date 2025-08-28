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

  // Generate SVG placeholder directly
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#${color}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#${textColor}" text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>
  `;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(svg);
});

module.exports = router;