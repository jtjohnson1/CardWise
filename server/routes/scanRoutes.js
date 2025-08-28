const express = require('express');
const Card = require('../models/Card');
const User = require('../models/User');
const ollamaService = require('../services/ollamaService');
const router = express.Router();

console.log('[SCAN_ROUTES] scanRoutes module loading...');

// In-memory storage for scan jobs
let scanJobs = [];

/**
 * Helper function to get or create admin user
 */
async function getOrCreateAdminUser() {
  try {
    // First try to find existing admin user
    let adminUser = await User.findOne({ email: 'admin@cardwise.com' });
    
    if (!adminUser) {
      console.log('Admin user not found, creating one...');
      // Create admin user if it doesn't exist
      const { hashPassword } = require('../utils/password');
      const hashedPassword = await hashPassword('admin123');
      
      adminUser = new User({
        email: 'admin@cardwise.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true,
        preferences: {
          theme: 'light',
          notifications: {
            email: true,
            push: true
          }
        }
      });
      
      adminUser = await adminUser.save();
      console.log('Admin user created successfully');
    }
    
    return adminUser;
  } catch (error) {
    console.error('Error getting/creating admin user:', error.message);
    throw error;
  }
}

/**
 * POST /api/scan/start
 * Start a new card scanning job using Ollama AI
 */
router.post('/api/scan/start', async (req, res) => {
  try {
    console.log('[SCAN_ROUTES] POST /api/scan/start - Starting new scan job');
    console.log('[SCAN_ROUTES] Request body:', JSON.stringify(req.body));

    const { jobName, folderPath, settings } = req.body;

    if (!jobName) {
      console.log('[SCAN_ROUTES] Validation failed: jobName is required');
      return res.status(400).json({
        success: false,
        error: 'Job name is required'
      });
    }

    if (!folderPath) {
      console.log('[SCAN_ROUTES] Validation failed: folderPath is required');
      return res.status(400).json({
        success: false,
        error: 'Folder path is required'
      });
    }

    // Test Ollama connection first
    console.log('[SCAN_ROUTES] Testing Ollama connection...');
    const ollamaConnected = await ollamaService.testConnection();
    if (!ollamaConnected) {
      return res.status(500).json({
        success: false,
        error: 'Cannot connect to Ollama service. Please ensure Ollama is running.'
      });
    }

    // Get or create admin user for card ownership
    const adminUser = await getOrCreateAdminUser();

    const jobId = 'scan_' + Date.now();
    const newJob = {
      _id: jobId,
      jobName: jobName,
      status: 'processing',
      totalCards: 0,
      processedCards: 0,
      failedCards: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: adminUser._id,
      folderPath: folderPath,
      settings: {
        confidenceThreshold: settings?.confidenceThreshold || 0.8,
        autoProcess: settings?.autoProcess || true,
        imageQuality: settings?.imageQuality || 'high'
      }
    };

    scanJobs.push(newJob);

    console.log(`[SCAN_ROUTES] Created new scan job: ${jobName} with ID: ${jobId}`);

    // Start processing in background
    processCardScanJob(jobId, folderPath, adminUser._id, settings);

    res.status(200).json({
      success: true,
      message: 'Scan job started successfully',
      jobId: jobId,
      job: newJob
    });

  } catch (error) {
    console.error('[SCAN_ROUTES] Error starting scan job:', error.message);
    console.error('[SCAN_ROUTES] Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to start scan job: ' + error.message
    });
  }
});

/**
 * Background processing function for card scanning
 */
async function processCardScanJob(jobId, folderPath, userId, settings) {
  try {
    console.log(`[SCAN_PROCESSING] Starting background processing for job ${jobId}`);
    
    const job = scanJobs.find(j => j._id === jobId);
    if (!job) {
      console.error(`[SCAN_PROCESSING] Job ${jobId} not found`);
      return;
    }

    // Process cards using Ollama
    const results = await ollamaService.processCardFolder(folderPath, (processed, total) => {
      // Update progress
      job.processedCards = processed;
      job.totalCards = total;
      job.updatedAt = new Date().toISOString();
      console.log(`[SCAN_PROCESSING] Job ${jobId} progress: ${processed}/${total}`);
    });

    let successCount = 0;
    let failureCount = 0;

    // Save successful card analyses to database
    for (const result of results) {
      if (result.success && result.cardData) {
        try {
          // Only save cards that meet confidence threshold
          const confidence = result.cardData.confidence || 0;
          if (confidence >= (settings?.confidenceThreshold || 0.8)) {
            
            const cardData = {
              ...result.cardData,
              userId: userId,
              lotNumber: job.jobName,
              tags: [job.jobName, 'scanned'],
              notes: `Scanned from ${folderPath} with confidence ${confidence}`
            };

            // Remove confidence field as it's not in the Card schema
            delete cardData.confidence;

            const card = new Card(cardData);
            await card.save();
            
            console.log(`[SCAN_PROCESSING] Saved card: ${result.cardData.playerName}`);
            successCount++;
          } else {
            console.log(`[SCAN_PROCESSING] Skipped card ${result.imageFile} due to low confidence: ${confidence}`);
            failureCount++;
          }
        } catch (saveError) {
          console.error(`[SCAN_PROCESSING] Error saving card from ${result.imageFile}:`, saveError.message);
          failureCount++;
        }
      } else {
        failureCount++;
      }
    }

    // Update job status
    job.status = 'completed';
    job.processedCards = results.length;
    job.failedCards = failureCount;
    job.updatedAt = new Date().toISOString();

    console.log(`[SCAN_PROCESSING] Job ${jobId} completed. Success: ${successCount}, Failed: ${failureCount}`);

  } catch (error) {
    console.error(`[SCAN_PROCESSING] Error processing job ${jobId}:`, error.message);
    
    // Update job status to failed
    const job = scanJobs.find(j => j._id === jobId);
    if (job) {
      job.status = 'failed';
      job.updatedAt = new Date().toISOString();
    }
  }
}

/**
 * GET /api/scan/jobs
 * Get all scan jobs
 */
router.get('/api/scan/jobs', (req, res) => {
  try {
    console.log('[SCAN_ROUTES] GET /api/scan/jobs - Fetching scan jobs');
    console.log('[SCAN_ROUTES] Available scan jobs:', scanJobs.length);

    res.status(200).json({
      success: true,
      jobs: scanJobs
    });
  } catch (error) {
    console.error('[SCAN_ROUTES] Error fetching scan jobs:', error.message);
    console.error('[SCAN_ROUTES] Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch scan jobs: ' + error.message
    });
  }
});

/**
 * GET /api/scan/progress/:jobId
 * Get scan job progress
 */
router.get('/api/scan/progress/:jobId', (req, res) => {
  try {
    const { jobId } = req.params;
    console.log(`[SCAN_ROUTES] GET /api/scan/progress/${jobId} - Fetching scan progress`);

    const job = scanJobs.find(j => j._id === jobId);
    if (!job) {
      console.log(`[SCAN_ROUTES] Scan job not found: ${jobId}`);
      return res.status(404).json({
        success: false,
        error: 'Scan job not found'
      });
    }

    console.log(`[SCAN_ROUTES] Found job: ${job.jobName}, status: ${job.status}`);
    res.status(200).json({
      success: true,
      progress: {
        jobId: jobId,
        currentCard: job.processedCards,
        totalCards: job.totalCards,
        status: job.status,
        processingTime: Math.floor((new Date() - new Date(job.createdAt)) / 1000),
        estimatedTimeRemaining: job.status === 'processing' && job.totalCards > 0 
          ? Math.floor(((new Date() - new Date(job.createdAt)) / job.processedCards) * (job.totalCards - job.processedCards) / 1000)
          : 0
      }
    });
  } catch (error) {
    console.error('[SCAN_ROUTES] Error fetching scan progress:', error.message);
    console.error('[SCAN_ROUTES] Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch scan progress: ' + error.message
    });
  }
});

/**
 * POST /api/scan/pause/:jobId
 * Pause a scan job
 */
router.post('/api/scan/pause/:jobId', (req, res) => {
  try {
    const { jobId } = req.params;
    console.log(`[SCAN_ROUTES] POST /api/scan/pause/${jobId} - Pausing scan job`);

    const job = scanJobs.find(j => j._id === jobId);
    if (!job) {
      console.log(`[SCAN_ROUTES] Scan job not found: ${jobId}`);
      return res.status(404).json({
        success: false,
        error: 'Scan job not found'
      });
    }

    job.status = 'paused';
    job.updatedAt = new Date().toISOString();

    console.log(`[SCAN_ROUTES] Paused job: ${job.jobName}`);
    res.status(200).json({
      success: true,
      message: 'Scan job paused successfully'
    });
  } catch (error) {
    console.error('[SCAN_ROUTES] Error pausing scan job:', error.message);
    console.error('[SCAN_ROUTES] Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to pause scan job: ' + error.message
    });
  }
});

/**
 * POST /api/scan/resume/:jobId
 * Resume a scan job
 */
router.post('/api/scan/resume/:jobId', (req, res) => {
  try {
    const { jobId } = req.params;
    console.log(`[SCAN_ROUTES] POST /api/scan/resume/${jobId} - Resuming scan job`);

    const job = scanJobs.find(j => j._id === jobId);
    if (!job) {
      console.log(`[SCAN_ROUTES] Scan job not found: ${jobId}`);
      return res.status(404).json({
        success: false,
        error: 'Scan job not found'
      });
    }

    job.status = 'processing';
    job.updatedAt = new Date().toISOString();

    console.log(`[SCAN_ROUTES] Resumed job: ${job.jobName}`);
    res.status(200).json({
      success: true,
      message: 'Scan job resumed successfully'
    });
  } catch (error) {
    console.error('[SCAN_ROUTES] Error resuming scan job:', error.message);
    console.error('[SCAN_ROUTES] Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to resume scan job: ' + error.message
    });
  }
});

/**
 * POST /api/scan/cancel/:jobId
 * Cancel a scan job
 */
router.post('/api/scan/cancel/:jobId', (req, res) => {
  try {
    const { jobId } = req.params;
    console.log(`[SCAN_ROUTES] POST /api/scan/cancel/${jobId} - Cancelling scan job`);

    const jobIndex = scanJobs.findIndex(j => j._id === jobId);
    if (jobIndex === -1) {
      console.log(`[SCAN_ROUTES] Scan job not found: ${jobId}`);
      return res.status(404).json({
        success: false,
        error: 'Scan job not found'
      });
    }

    const cancelledJob = scanJobs[jobIndex];
    scanJobs.splice(jobIndex, 1);

    console.log(`[SCAN_ROUTES] Cancelled job: ${cancelledJob.jobName}`);
    res.status(200).json({
      success: true,
      message: 'Scan job cancelled successfully'
    });
  } catch (error) {
    console.error('[SCAN_ROUTES] Error cancelling scan job:', error.message);
    console.error('[SCAN_ROUTES] Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel scan job: ' + error.message
    });
  }
});

console.log('[SCAN_ROUTES] All scan routes defined');
console.log('[SCAN_ROUTES] scanRoutes module loaded successfully');

module.exports = router;