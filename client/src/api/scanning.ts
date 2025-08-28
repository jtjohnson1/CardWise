import api from './api';

export interface ScanJob {
  _id: string;
  jobName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'paused';
  totalCards: number;
  processedCards: number;
  failedCards: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  settings: {
    confidenceThreshold: number;
    autoProcess: boolean;
    imageQuality: string;
  };
}

export interface ScanProgress {
  jobId: string;
  currentCard: number;
  totalCards: number;
  status: string;
  processingTime: number;
  estimatedTimeRemaining: number;
}

// Description: Start a new card scanning job
// Endpoint: POST /api/scan/start
// Request: { jobName: string, folderPath: string, settings?: object }
// Response: { success: boolean, message: string, jobId: string }
export const startScanJob = async (jobData: { jobName: string; folderPath: string; settings?: any }) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Scan job started successfully',
        jobId: 'scan_' + Date.now()
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.post('/api/scan/start', jobData);
  //   return response.data;
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Get all scan jobs for the current user
// Endpoint: GET /api/scan/jobs
// Request: {}
// Response: { success: boolean, jobs: ScanJob[] }
export const getScanJobs = async () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        jobs: [
          {
            _id: 'job1',
            jobName: 'Baseball Cards Lot 1',
            status: 'completed' as const,
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
            status: 'processing' as const,
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
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.get('/api/scan/jobs');
  //   return response.data;
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Get recent scan jobs for the current user (alias for getScanJobs)
// Endpoint: GET /api/scan/jobs
// Request: {}
// Response: { success: boolean, jobs: ScanJob[] }
export const getRecentScanJobs = async () => {
  // This is essentially the same as getScanJobs but can be filtered for recent jobs
  return getScanJobs();
};

// Description: Get scan job progress/status
// Endpoint: GET /api/scan/progress/:jobId
// Request: {}
// Response: { success: boolean, progress: ScanProgress }
export const getScanProgress = async (jobId: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        progress: {
          jobId: jobId,
          currentCard: 15,
          totalCards: 25,
          status: 'processing',
          processingTime: 300,
          estimatedTimeRemaining: 200
        }
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.get(`/api/scan/progress/${jobId}`);
  //   return response.data;
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Get scan job status (alias for getScanProgress)
// Endpoint: GET /api/scan/progress/:jobId
// Request: {}
// Response: { success: boolean, progress: ScanProgress }
export const getScanJobStatus = async (jobId: string) => {
  // This is an alias for getScanProgress
  return getScanProgress(jobId);
};

// Description: Pause a running scan job
// Endpoint: POST /api/scan/pause/:jobId
// Request: {}
// Response: { success: boolean, message: string }
export const pauseScanJob = async (jobId: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Scan job paused successfully'
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.post(`/api/scan/pause/${jobId}`);
  //   return response.data;
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Resume a paused scan job
// Endpoint: POST /api/scan/resume/:jobId
// Request: {}
// Response: { success: boolean, message: string }
export const resumeScanJob = async (jobId: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Scan job resumed successfully'
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.post(`/api/scan/resume/${jobId}`);
  //   return response.data;
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Pause or resume a scan job based on current status
// Endpoint: POST /api/scan/pause/:jobId or POST /api/scan/resume/:jobId
// Request: { jobId: string, currentStatus: string }
// Response: { success: boolean, message: string }
export const pauseResumeJob = async (jobId: string, currentStatus: string) => {
  // If job is currently processing, pause it. If paused, resume it.
  if (currentStatus === 'processing') {
    return pauseScanJob(jobId);
  } else if (currentStatus === 'paused') {
    return resumeScanJob(jobId);
  } else {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: false,
          message: `Cannot pause/resume job with status: ${currentStatus}`
        });
      }, 100);
    });
  }
};

// Description: Cancel a scan job
// Endpoint: POST /api/scan/cancel/:jobId
// Request: {}
// Response: { success: boolean, message: string }
export const cancelScanJob = async (jobId: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Scan job cancelled successfully'
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const response = await api.post(`/api/scan/cancel/${jobId}`);
  //   return response.data;
  // } catch (error: any) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};