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
// Response: { success: boolean, message: string, jobId: string, job: ScanJob }
export const startScanJob = async (jobData: { jobName: string; folderPath: string; settings?: any }) => {
  try {
    const response = await api.post('/api/scan/start', jobData);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get all scan jobs for the current user
// Endpoint: GET /api/scan/jobs
// Request: {}
// Response: { success: boolean, jobs: ScanJob[] }
export const getScanJobs = async () => {
  try {
    const response = await api.get('/api/scan/jobs');
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get recent scan jobs for the current user (alias for getScanJobs)
// Endpoint: GET /api/scan/jobs
// Request: {}
// Response: { success: boolean, jobs: ScanJob[] }
export const getRecentScanJobs = async () => {
  return getScanJobs();
};

// Description: Get scan job progress/status
// Endpoint: GET /api/scan/progress/:jobId
// Request: {}
// Response: { success: boolean, progress: ScanProgress }
export const getScanProgress = async (jobId: string) => {
  try {
    const response = await api.get(`/api/scan/progress/${jobId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get scan job status (alias for getScanProgress)
// Endpoint: GET /api/scan/progress/:jobId
// Request: {}
// Response: { success: boolean, progress: ScanProgress }
export const getScanJobStatus = async (jobId: string) => {
  return getScanProgress(jobId);
};

// Description: Pause a running scan job
// Endpoint: POST /api/scan/pause/:jobId
// Request: {}
// Response: { success: boolean, message: string }
export const pauseScanJob = async (jobId: string) => {
  try {
    const response = await api.post(`/api/scan/pause/${jobId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Resume a paused scan job
// Endpoint: POST /api/scan/resume/:jobId
// Request: {}
// Response: { success: boolean, message: string }
export const resumeScanJob = async (jobId: string) => {
  try {
    const response = await api.post(`/api/scan/resume/${jobId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Pause or resume a scan job based on current status
// Endpoint: POST /api/scan/pause/:jobId or POST /api/scan/resume/:jobId
// Request: { jobId: string, currentStatus: string }
// Response: { success: boolean, message: string }
export const pauseResumeJob = async (jobId: string, currentStatus: string) => {
  if (currentStatus === 'processing') {
    return pauseScanJob(jobId);
  } else if (currentStatus === 'paused') {
    return resumeScanJob(jobId);
  } else {
    throw new Error(`Cannot pause/resume job with status: ${currentStatus}`);
  }
};

// Description: Cancel a scan job
// Endpoint: POST /api/scan/cancel/:jobId
// Request: {}
// Response: { success: boolean, message: string }
export const cancelScanJob = async (jobId: string) => {
  try {
    const response = await api.post(`/api/scan/cancel/${jobId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};