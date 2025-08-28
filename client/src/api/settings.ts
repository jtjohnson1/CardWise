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