import api from './api';

export interface ScanJob {
  _id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'paused';
  lotNumber: string;
  totalCards: number;
  processedCards: number;
  failedCards: number;
  extractedData?: CardExtractionResult[];
  createdAt: string;
  completedAt?: string;
  error?: string;
  estimatedTimeRemaining?: number;
  processingSpeed?: number; // cards per minute
  currentBatch?: number;
  totalBatches?: number;
}

export interface CardExtractionResult {
  cardNumber: number;
  playerName?: string;
  sport?: string;
  year?: number;
  manufacturer?: string;
  setName?: string;
  confidence: number;
  frontImagePath: string;
  backImagePath: string;
  status: 'success' | 'failed' | 'needs_review';
  errorMessage?: string;
}

export interface ScanProgress {
  jobId: string;
  currentCard: number;
  totalCards: number;
  currentBatch: number;
  totalBatches: number;
  processingSpeed: number;
  estimatedTimeRemaining: number;
  recentExtractions: CardExtractionResult[];
}

// Description: Start scanning process for new cards with batch processing
// Endpoint: POST /api/scan/start
// Request: { folderPath: string, batchSize?: number, skipExisting?: boolean }
// Response: { success: boolean, job: ScanJob }
export const startScanJob = (folderPath: string, batchSize: number = 50, skipExisting: boolean = true) => {
  console.log('Starting scan job for folder:', folderPath, 'with batch size:', batchSize);
  return new Promise((resolve) => {
    setTimeout(() => {
      const totalCards = Math.floor(Math.random() * 1000) + 500; // Simulate 500-1500 cards
      const totalBatches = Math.ceil(totalCards / batchSize);
      
      resolve({
        success: true,
        job: {
          _id: Date.now().toString(),
          status: 'processing',
          lotNumber: `LOT-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
          totalCards,
          processedCards: 0,
          failedCards: 0,
          createdAt: new Date().toISOString(),
          currentBatch: 1,
          totalBatches,
          processingSpeed: 0,
          estimatedTimeRemaining: 0
        }
      });
    }, 1000);
  });
  // try {
  //   return await api.post('/api/scan/start', { folderPath, batchSize, skipExisting });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get detailed scan job progress
// Endpoint: GET /api/scan/job/:id/progress
// Request: {}
// Response: { progress: ScanProgress }
export const getScanProgress = (jobId: string) => {
  console.log('Getting detailed scan progress:', jobId);
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentCard = Math.floor(Math.random() * 800) + 100;
      const totalCards = 1200;
      const processingSpeed = 25; // cards per minute
      const remainingCards = totalCards - currentCard;
      const estimatedTimeRemaining = Math.ceil(remainingCards / processingSpeed);
      
      resolve({
        progress: {
          jobId,
          currentCard,
          totalCards,
          currentBatch: Math.ceil(currentCard / 50),
          totalBatches: Math.ceil(totalCards / 50),
          processingSpeed,
          estimatedTimeRemaining,
          recentExtractions: [
            {
              cardNumber: currentCard - 2,
              playerName: 'Mike Trout',
              sport: 'Baseball',
              year: 2020,
              manufacturer: 'Topps',
              setName: 'Chrome',
              confidence: 0.95,
              frontImagePath: '/scans/lot-001-45-front.jpg',
              backImagePath: '/scans/lot-001-45-back.jpg',
              status: 'success'
            },
            {
              cardNumber: currentCard - 1,
              playerName: 'Unknown Player',
              sport: 'Basketball',
              confidence: 0.65,
              frontImagePath: '/scans/lot-001-46-front.jpg',
              backImagePath: '/scans/lot-001-46-back.jpg',
              status: 'needs_review',
              errorMessage: 'Low confidence in player identification'
            }
          ]
        }
      });
    }, 500);
  });
  // try {
  //   return await api.get(`/api/scan/job/${jobId}/progress`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Pause/Resume scan job
// Endpoint: POST /api/scan/job/:id/pause
// Request: { action: 'pause' | 'resume' }
// Response: { success: boolean, status: string }
export const pauseResumeJob = (jobId: string, action: 'pause' | 'resume') => {
  console.log(`${action} scan job:`, jobId);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        status: action === 'pause' ? 'paused' : 'processing'
      });
    }, 500);
  });
  // try {
  //   return await api.post(`/api/scan/job/${jobId}/pause`, { action });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get scan job status
// Endpoint: GET /api/scan/job/:id
// Request: {}
// Response: { job: ScanJob }
export const getScanJobStatus = (jobId: string) => {
  console.log('Getting scan job status:', jobId);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        job: {
          _id: jobId,
          status: 'processing',
          lotNumber: 'LOT-2024-001',
          totalCards: 1200,
          processedCards: Math.floor(Math.random() * 800) + 100,
          failedCards: Math.floor(Math.random() * 10),
          createdAt: new Date().toISOString(),
          currentBatch: 8,
          totalBatches: 24,
          processingSpeed: 25,
          estimatedTimeRemaining: 15,
          extractedData: [
            {
              cardNumber: 1,
              playerName: 'Mike Trout',
              sport: 'Baseball',
              year: 2020,
              confidence: 0.95,
              frontImagePath: '/scans/lot-001-1-front.jpg',
              backImagePath: '/scans/lot-001-1-back.jpg',
              status: 'success'
            }
          ]
        }
      });
    }, 500);
  });
  // try {
  //   return await api.get(`/api/scan/job/${jobId}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get recent scan jobs
// Endpoint: GET /api/scan/jobs
// Request: {}
// Response: { jobs: ScanJob[] }
export const getRecentScanJobs = () => {
  console.log('Fetching recent scan jobs...');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        jobs: [
          {
            _id: '1',
            status: 'completed',
            lotNumber: 'LOT-2024-001',
            totalCards: 1200,
            processedCards: 1200,
            failedCards: 8,
            createdAt: '2024-01-20T10:00:00Z',
            completedAt: '2024-01-20T12:15:00Z',
            currentBatch: 24,
            totalBatches: 24,
            processingSpeed: 28
          },
          {
            _id: '2',
            status: 'processing',
            lotNumber: 'LOT-2024-002',
            totalCards: 850,
            processedCards: 425,
            failedCards: 3,
            createdAt: '2024-01-20T14:00:00Z',
            currentBatch: 9,
            totalBatches: 17,
            processingSpeed: 25,
            estimatedTimeRemaining: 17
          }
        ]
      });
    }, 500);
  });
  // try {
  //   return await api.get('/api/scan/jobs');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};