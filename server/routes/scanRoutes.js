const express = require('express');
const router = express.Router();

// Mock scan jobs data
let scanJobs = [
  {
    _id: 'job1',
    jobName: 'Baseball Cards Lot 1',
    status: 'completed',
    totalCards: 50,
    processedCards: 50,
    failedCards: 0,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T11:45:00Z',
    userId: 'admin',
    settings: {
      confidenceThreshold: 0.8,
      autoProcess: true,
      imageQuality: 'high'
    }
  },
  {
    _id: 'job2',
    jobName: 'Basketball Cards Lot 2',
    status: 'processing',
    totalCards: 25,
    processedCards: 15,
    failedCards: 1,
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-16T09:45:00Z',
    userId: 'admin',
    settings: {
      confidenceThreshold: 0.8,
      autoProcess: true,
      imageQuality: 'high'
    }
  }
];

/**
 * POST /api/scan/start
 * Start a new card scanning job
 */
router.post('/api/scan/start', (req, res) => {
  try {
    console.log('POST /api/scan/start - Starting new scan job');
    console.log('Request body:', JSON.stringify(req.body));
    console.log('Request headers:', JSON.stringify(req.headers));
    
    const { jobName, folderPath, settings } = req.body;

    if (!jobName) {
      console.log('Validation failed: jobName is required');
      return res.status(400).json({
        success: false,
        error: 'Job name is required'
      });
    }

    const jobId = 'scan_' + Date.now();
    const newJob = {
      _id: jobId,
      jobName: jobName,
      status: 'pending',
      totalCards: 25,
      processedCards: 0,
      failedCards: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'admin',
      settings: {
        confidenceThreshold: settings?.confidenceThreshold || 0.8,
        autoProcess: settings?.autoProcess || true,
        imageQuality: settings?.imageQuality || 'high'
      }
    };

    scanJobs.push(newJob);

    console.log(`Created new scan job: ${jobName} with ID: ${jobId}`);
    res.status(200).json({
      success: true,
      message: 'Scan job started successfully',
      jobId: jobId,
      job: newJob
    });
  } catch (error) {
    console.error('Error starting scan job:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to start scan job: ' + error.message
    });
  }
});

/**
 * GET /api/scan/jobs
 * Get all scan jobs
 */
router.get('/api/scan/jobs', (req, res) => {
  try {
    console.log('GET /api/scan/jobs - Fetching scan jobs');

    res.status(200).json({
      success: true,
      jobs: scanJobs
    });
  } catch (error) {
    console.error('Error fetching scan jobs:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch scan jobs'
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
    console.log(`GET /api/scan/progress/${jobId} - Fetching scan progress`);

    const job = scanJobs.find(j => j._id === jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Scan job not found'
      });
    }

    res.status(200).json({
      success: true,
      progress: {
        jobId: jobId,
        currentCard: job.processedCards,
        totalCards: job.totalCards,
        status: job.status,
        processingTime: 300,
        estimatedTimeRemaining: job.status === 'processing' ? 200 : 0
      }
    });
  } catch (error) {
    console.error('Error fetching scan progress:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch scan progress'
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
    console.log(`POST /api/scan/pause/${jobId} - Pausing scan job`);

    const job = scanJobs.find(j => j._id === jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Scan job not found'
      });
    }

    job.status = 'paused';
    job.updatedAt = new Date().toISOString();

    res.status(200).json({
      success: true,
      message: 'Scan job paused successfully'
    });
  } catch (error) {
    console.error('Error pausing scan job:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to pause scan job'
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
    console.log(`POST /api/scan/resume/${jobId} - Resuming scan job`);

    const job = scanJobs.find(j => j._id === jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Scan job not found'
      });
    }

    job.status = 'processing';
    job.updatedAt = new Date().toISOString();

    res.status(200).json({
      success: true,
      message: 'Scan job resumed successfully'
    });
  } catch (error) {
    console.error('Error resuming scan job:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to resume scan job'
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
    console.log(`POST /api/scan/cancel/${jobId} - Cancelling scan job`);

    const jobIndex = scanJobs.findIndex(j => j._id === jobId);
    if (jobIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Scan job not found'
      });
    }

    scanJobs.splice(jobIndex, 1);

    res.status(200).json({
      success: true,
      message: 'Scan job cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling scan job:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel scan job'
    });
  }
});

module.exports = router;