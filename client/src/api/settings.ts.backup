import api from './api';

export interface EbayConfig {
  appId: string;
  devId: string;
  certId: string;
  userToken: string;
  environment: 'sandbox' | 'production';
}

export interface TcgPlayerConfig {
  apiKey: string;
  partnerId: string;
  environment: 'sandbox' | 'production';
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  priceAlerts: boolean;
  tradeRequests: boolean;
  marketUpdates: boolean;
}

export interface ScanningPreferences {
  autoProcess: boolean;
  confidenceThreshold: number;
  imageQuality: 'low' | 'medium' | 'high';
  batchSize: number;
}

// Description: Save eBay API configuration
// Endpoint: POST /api/settings/ebay
// Request: { appId: string, devId: string, certId: string, userToken: string, environment: string }
// Response: { success: boolean, message: string }
export const saveEbayConfig = async (config: EbayConfig) => {
  try {
    console.log('Saving eBay configuration:', { ...config, certId: '[REDACTED]', userToken: '[REDACTED]' });
    const response = await api.post('/api/settings/ebay', config);
    console.log('eBay configuration saved successfully');
    return response.data;
  } catch (error: any) {
    console.error('Failed to save eBay configuration:', error);
    throw new Error(error?.response?.data?.error || error.message || 'Failed to save eBay configuration');
  }
};

// Description: Get eBay API configuration
// Endpoint: GET /api/settings/ebay
// Request: {}
// Response: { appId: string, devId: string, certId: string, userToken: string, environment: string }
export const getEbayConfig = async (): Promise<EbayConfig> => {
  try {
    console.log('Fetching eBay configuration');
    const response = await api.get('/api/settings/ebay');
    console.log('eBay configuration fetched successfully');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch eBay configuration:', error);
    throw new Error(error?.response?.data?.error || error.message || 'Failed to fetch eBay configuration');
  }
};

// Description: Save TCGPlayer API configuration
// Endpoint: POST /api/settings/tcgplayer
// Request: { apiKey: string, partnerId: string, environment: string }
// Response: { success: boolean, message: string }
export const saveTcgPlayerConfig = async (config: TcgPlayerConfig) => {
  try {
    console.log('Saving TCGPlayer configuration:', { ...config, apiKey: '[REDACTED]' });
    const response = await api.post('/api/settings/tcgplayer', config);
    console.log('TCGPlayer configuration saved successfully');
    return response.data;
  } catch (error: any) {
    console.error('Failed to save TCGPlayer configuration:', error);
    throw new Error(error?.response?.data?.error || error.message || 'Failed to save TCGPlayer configuration');
  }
};

// Description: Get TCGPlayer API configuration
// Endpoint: GET /api/settings/tcgplayer
// Request: {}
// Response: { apiKey: string, partnerId: string, environment: string }
export const getTcgPlayerConfig = async (): Promise<TcgPlayerConfig> => {
  try {
    console.log('Fetching TCGPlayer configuration');
    const response = await api.get('/api/settings/tcgplayer');
    console.log('TCGPlayer configuration fetched successfully');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch TCGPlayer configuration:', error);
    throw new Error(error?.response?.data?.error || error.message || 'Failed to fetch TCGPlayer configuration');
  }
};

// Description: Save notification preferences
// Endpoint: POST /api/settings/notifications
// Request: { email: boolean, push: boolean, priceAlerts: boolean, tradeRequests: boolean, marketUpdates: boolean }
// Response: { success: boolean, message: string }
export const saveNotificationPreferences = async (preferences: NotificationPreferences) => {
  try {
    console.log('Saving notification preferences:', preferences);
    const response = await api.post('/api/settings/notifications', preferences);
    console.log('Notification preferences saved successfully');
    return response.data;
  } catch (error: any) {
    console.error('Failed to save notification preferences:', error);
    throw new Error(error?.response?.data?.error || error.message || 'Failed to save notification preferences');
  }
};

// Description: Get notification preferences
// Endpoint: GET /api/settings/notifications
// Request: {}
// Response: { email: boolean, push: boolean, priceAlerts: boolean, tradeRequests: boolean, marketUpdates: boolean }
export const getNotificationPreferences = async (): Promise<NotificationPreferences> => {
  try {
    console.log('Fetching notification preferences');
    const response = await api.get('/api/settings/notifications');
    console.log('Notification preferences fetched successfully');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch notification preferences:', error);
    throw new Error(error?.response?.data?.error || error.message || 'Failed to fetch notification preferences');
  }
};

// Description: Save scanning preferences
// Endpoint: POST /api/settings/scanning
// Request: { autoProcess: boolean, confidenceThreshold: number, imageQuality: string, batchSize: number }
// Response: { success: boolean, message: string }
export const saveScanningPreferences = async (preferences: ScanningPreferences) => {
  try {
    console.log('Saving scanning preferences:', preferences);
    const response = await api.post('/api/settings/scanning', preferences);
    console.log('Scanning preferences saved successfully');
    return response.data;
  } catch (error: any) {
    console.error('Failed to save scanning preferences:', error);
    throw new Error(error?.response?.data?.error || error.message || 'Failed to save scanning preferences');
  }
};

// Description: Get scanning preferences
// Endpoint: GET /api/settings/scanning
// Request: {}
// Response: { autoProcess: boolean, confidenceThreshold: number, imageQuality: string, batchSize: number }
export const getScanningPreferences = async (): Promise<ScanningPreferences> => {
  try {
    console.log('Fetching scanning preferences');
    const response = await api.get('/api/settings/scanning');
    console.log('Scanning preferences fetched successfully');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch scanning preferences:', error);
    throw new Error(error?.response?.data?.error || error.message || 'Failed to fetch scanning preferences');
  }
};

// Description: Export collection data
// Endpoint: GET /api/settings/export
// Request: { format?: string }
// Response: Blob data
export const exportCollection = async (format: 'csv' | 'json' = 'csv') => {
  try {
    console.log(`Exporting collection in ${format} format`);
    const response = await api.get(`/api/settings/export?format=${format}`, {
      responseType: 'blob'
    });
    console.log('Collection exported successfully');
    return response.data;
  } catch (error: any) {
    console.error('Failed to export collection:', error);
    throw new Error(error?.response?.data?.error || error.message || 'Failed to export collection');
  }
};

// Description: Import collection data
// Endpoint: POST /api/settings/import
// Request: FormData with file
// Response: { success: boolean, message: string }
export const importCollection = async (file: File) => {
  try {
    console.log('Importing collection from file:', file.name);
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/settings/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('Collection imported successfully');
    return response.data;
  } catch (error: any) {
    console.error('Failed to import collection:', error);
    throw new Error(error?.response?.data?.error || error.message || 'Failed to import collection');
  }
};

// Description: Create database backup
// Endpoint: POST /api/settings/backup
// Request: {}
// Response: { success: boolean, message: string }
export const backupDatabase = async () => {
  try {
    console.log('Creating database backup');
    const response = await api.post('/api/settings/backup');
    console.log('Database backup created successfully');
    return response.data;
  } catch (error: any) {
    console.error('Failed to create database backup:', error);
    throw new Error(error?.response?.data?.error || error.message || 'Failed to create database backup');
  }
};

// Description: Perform database maintenance
// Endpoint: POST /api/settings/maintenance
// Request: {}
// Response: { success: boolean, message: string }
export const performDatabaseMaintenance = async () => {
  try {
    console.log('Performing database maintenance');
    const response = await api.post('/api/settings/maintenance');
    console.log('Database maintenance completed successfully');
    return response.data;
  } catch (error: any) {
    console.error('Failed to perform database maintenance:', error);
    throw new Error(error?.response?.data?.error || error.message || 'Failed to perform database maintenance');
  }
};

// Description: Clear all collection data
// Endpoint: DELETE /api/settings/clear-all
// Request: {}
// Response: { success: boolean, message: string }
export const clearAllCollectionData = async () => {
  try {
    console.log('Clearing all collection data');
    const response = await api.delete('/api/settings/clear-all');
    console.log('All collection data cleared successfully');
    return response.data;
  } catch (error: any) {
    console.error('Failed to clear collection data:', error);
    throw new Error(error?.response?.data?.error || error.message || 'Failed to clear collection data');
  }
};

// Description: Rotate eBay Cert ID
// Endpoint: POST /api/settings/ebay/rotate-cert
// Request: {}
// Response: { success: boolean, message: string }
export const rotateCertId = async () => {
  try {
    console.log('Rotating eBay Cert ID');
    const response = await api.post('/api/settings/ebay/rotate-cert');
    console.log('eBay Cert ID rotated successfully');
    return response.data;
  } catch (error: any) {
    console.error('Failed to rotate eBay Cert ID:', error);
    throw new Error(error?.response?.data?.error || error.message || 'Failed to rotate eBay Cert ID');
  }
};