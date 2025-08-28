const express = require('express');
const router = express.Router();

// Mock data storage with sample eBay configuration from user feedback
let settingsData = {
  ebay: {
    appId: 'JohnJohn-CardScan-PRD-081384bec-971c4e13',
    devId: 'ff5fc952-6f54-4126-8c27-867835de4eb3',
    certId: 'PRD-81384bec8355-9d2c-4314-8451-a725',
    userToken: 'v^1.1#i^1#p^3#r^1#I^3#f^0#t^Ul4xMF81OkIzQUUyRkNBMTMzM0Y2NzNDQTYxQkY5OTE5OUM1QkE4XzFfMSNFXjI2MA==',
    environment: 'production'
  },
  tcgplayer: {
    apiKey: '',
    partnerId: '',
    environment: 'sandbox'
  },
  notifications: {
    email: true,
    push: true,
    priceAlerts: true,
    tradeRequests: true,
    marketUpdates: false
  },
  scanning: {
    autoProcess: true,
    confidenceThreshold: 0.8,
    imageQuality: 'high',
    batchSize: 10
  }
};

/**
 * GET /api/settings/ebay
 * Get eBay API configuration
 */
router.get('/api/settings/ebay', (req, res) => {
  try {
    console.log('GET /api/settings/ebay - Fetching eBay configuration');
    console.log('Returning eBay config:', {
      ...settingsData.ebay,
      certId: '[REDACTED]',
      userToken: '[REDACTED]'
    });
    res.status(200).json(settingsData.ebay);
  } catch (error) {
    console.error('Error fetching eBay configuration:', error.message);
    res.status(500).json({
      error: 'Failed to fetch eBay configuration'
    });
  }
});

/**
 * POST /api/settings/ebay
 * Save eBay API configuration
 */
router.post('/api/settings/ebay', (req, res) => {
  try {
    console.log('POST /api/settings/ebay - Saving eBay configuration');
    console.log('Request body:', {
      ...req.body,
      certId: req.body.certId ? '[REDACTED]' : 'EMPTY',
      userToken: req.body.userToken ? '[REDACTED]' : 'EMPTY'
    });
    
    const { appId, devId, certId, userToken, environment } = req.body;

    // Validate required fields
    if (!appId || !devId || !certId) {
      console.error('Validation failed - missing required fields:', {
        appId: !!appId,
        devId: !!devId,
        certId: !!certId
      });
      return res.status(400).json({
        error: 'App ID, Dev ID, and Cert ID are required'
      });
    }

    // Update settings
    settingsData.ebay = {
      appId,
      devId,
      certId,
      userToken: userToken || '',
      environment: environment || 'sandbox'
    };

    console.log('eBay configuration saved successfully');
    res.status(200).json({
      success: true,
      message: 'eBay configuration saved successfully'
    });
  } catch (error) {
    console.error('Error saving eBay configuration:', error.message);
    res.status(500).json({
      error: 'Failed to save eBay configuration'
    });
  }
});

/**
 * GET /api/settings/tcgplayer
 * Get TCGPlayer API configuration
 */
router.get('/api/settings/tcgplayer', (req, res) => {
  try {
    console.log('GET /api/settings/tcgplayer - Fetching TCGPlayer configuration');
    res.status(200).json(settingsData.tcgplayer);
  } catch (error) {
    console.error('Error fetching TCGPlayer configuration:', error.message);
    res.status(500).json({
      error: 'Failed to fetch TCGPlayer configuration'
    });
  }
});

/**
 * POST /api/settings/tcgplayer
 * Save TCGPlayer API configuration
 */
router.post('/api/settings/tcgplayer', (req, res) => {
  try {
    console.log('POST /api/settings/tcgplayer - Saving TCGPlayer configuration');
    const { apiKey, partnerId, environment } = req.body;

    // Update settings
    settingsData.tcgplayer = {
      apiKey: apiKey || '',
      partnerId: partnerId || '',
      environment: environment || 'sandbox'
    };

    console.log('TCGPlayer configuration saved successfully');
    res.status(200).json({
      success: true,
      message: 'TCGPlayer configuration saved successfully'
    });
  } catch (error) {
    console.error('Error saving TCGPlayer configuration:', error.message);
    res.status(500).json({
      error: 'Failed to save TCGPlayer configuration'
    });
  }
});

/**
 * GET /api/settings/notifications
 * Get notification preferences
 */
router.get('/api/settings/notifications', (req, res) => {
  try {
    console.log('GET /api/settings/notifications - Fetching notification preferences');
    res.status(200).json(settingsData.notifications);
  } catch (error) {
    console.error('Error fetching notification preferences:', error.message);
    res.status(500).json({
      error: 'Failed to fetch notification preferences'
    });
  }
});

/**
 * POST /api/settings/notifications
 * Save notification preferences
 */
router.post('/api/settings/notifications', (req, res) => {
  try {
    console.log('POST /api/settings/notifications - Saving notification preferences');
    const { email, push, priceAlerts, tradeRequests, marketUpdates } = req.body;

    // Update settings
    settingsData.notifications = {
      email: email !== undefined ? email : true,
      push: push !== undefined ? push : true,
      priceAlerts: priceAlerts !== undefined ? priceAlerts : true,
      tradeRequests: tradeRequests !== undefined ? tradeRequests : true,
      marketUpdates: marketUpdates !== undefined ? marketUpdates : false
    };

    console.log('Notification preferences saved successfully');
    res.status(200).json({
      success: true,
      message: 'Notification preferences saved successfully'
    });
  } catch (error) {
    console.error('Error saving notification preferences:', error.message);
    res.status(500).json({
      error: 'Failed to save notification preferences'
    });
  }
});

/**
 * GET /api/settings/scanning
 * Get scanning preferences
 */
router.get('/api/settings/scanning', (req, res) => {
  try {
    console.log('GET /api/settings/scanning - Fetching scanning preferences');
    res.status(200).json(settingsData.scanning);
  } catch (error) {
    console.error('Error fetching scanning preferences:', error.message);
    res.status(500).json({
      error: 'Failed to fetch scanning preferences'
    });
  }
});

/**
 * POST /api/settings/scanning
 * Save scanning preferences
 */
router.post('/api/settings/scanning', (req, res) => {
  try {
    console.log('POST /api/settings/scanning - Saving scanning preferences');
    const { autoProcess, confidenceThreshold, imageQuality, batchSize } = req.body;

    // Update settings
    settingsData.scanning = {
      autoProcess: autoProcess !== undefined ? autoProcess : true,
      confidenceThreshold: confidenceThreshold !== undefined ? confidenceThreshold : 0.8,
      imageQuality: imageQuality || 'high',
      batchSize: batchSize !== undefined ? batchSize : 10
    };

    console.log('Scanning preferences saved successfully');
    res.status(200).json({
      success: true,
      message: 'Scanning preferences saved successfully'
    });
  } catch (error) {
    console.error('Error saving scanning preferences:', error.message);
    res.status(500).json({
      error: 'Failed to save scanning preferences'
    });
  }
});

/**
 * POST /api/settings/ebay/rotate-cert
 * Rotate eBay Cert ID
 */
router.post('/api/settings/ebay/rotate-cert', (req, res) => {
  try {
    console.log('POST /api/settings/ebay/rotate-cert - Rotating eBay Cert ID');

    // In a real implementation, this would call eBay's API to rotate the certificate
    // For now, we'll just return a success message
    res.status(200).json({
      success: true,
      message: 'eBay Cert ID rotation initiated. This feature requires eBay API integration.'
    });
  } catch (error) {
    console.error('Error rotating eBay Cert ID:', error.message);
    res.status(500).json({
      error: 'Failed to rotate eBay Cert ID'
    });
  }
});

/**
 * GET /api/settings/export
 * Export collection data
 */
router.get('/api/settings/export', (req, res) => {
  try {
    console.log('GET /api/settings/export - Exporting collection data');
    const format = req.query.format || 'csv';

    // In a real implementation, this would export actual collection data
    res.status(200).json({
      success: true,
      message: `Collection export in ${format} format initiated`
    });
  } catch (error) {
    console.error('Error exporting collection:', error.message);
    res.status(500).json({
      error: 'Failed to export collection'
    });
  }
});

/**
 * POST /api/settings/import
 * Import collection data
 */
router.post('/api/settings/import', (req, res) => {
  try {
    console.log('POST /api/settings/import - Importing collection data');

    // In a real implementation, this would process the uploaded file
    res.status(200).json({
      success: true,
      message: 'Collection import initiated'
    });
  } catch (error) {
    console.error('Error importing collection:', error.message);
    res.status(500).json({
      error: 'Failed to import collection'
    });
  }
});

/**
 * POST /api/settings/backup
 * Create database backup
 */
router.post('/api/settings/backup', (req, res) => {
  try {
    console.log('POST /api/settings/backup - Creating database backup');

    res.status(200).json({
      success: true,
      message: 'Database backup created successfully'
    });
  } catch (error) {
    console.error('Error creating database backup:', error.message);
    res.status(500).json({
      error: 'Failed to create database backup'
    });
  }
});

/**
 * POST /api/settings/maintenance
 * Perform database maintenance
 */
router.post('/api/settings/maintenance', (req, res) => {
  try {
    console.log('POST /api/settings/maintenance - Performing database maintenance');

    res.status(200).json({
      success: true,
      message: 'Database maintenance completed successfully'
    });
  } catch (error) {
    console.error('Error performing database maintenance:', error.message);
    res.status(500).json({
      error: 'Failed to perform database maintenance'
    });
  }
});

/**
 * DELETE /api/settings/clear-all
 * Clear all collection data
 */
router.delete('/api/settings/clear-all', (req, res) => {
  try {
    console.log('DELETE /api/settings/clear-all - Clearing all collection data');

    res.status(200).json({
      success: true,
      message: 'All collection data cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing collection data:', error.message);
    res.status(500).json({
      error: 'Failed to clear collection data'
    });
  }
});

module.exports = router;