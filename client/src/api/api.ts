import axios, { AxiosRequestConfig, AxiosError, InternalAxiosRequestConfig, AxiosInstance } from 'axios';
import JSONbig from 'json-bigint';

const localApi = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => {
    return status >= 200 && status < 300;
  },
  transformResponse: [(data) => {
    try {
      return JSONbig.parse(data);
    } catch (error) {
      return data;
    }
  }],
  transformRequest: [(data, headers) => {
    if (data && typeof data === 'object') {
      console.log('[API] Transforming request data:', JSON.stringify(data));
      return JSON.stringify(data);
    }
    console.log('[API] Request data is not an object:', data);
    return data;
  }]
});

let accessToken: string | null = null;

const getApiInstance = (url: string) => {
  return localApi;
};

const isAuthEndpoint = (url: string): boolean => {
  return url.includes("/api/auth");
};

const api = {
  request: (config: AxiosRequestConfig) => {
    console.log('[API] Making request with config:', JSON.stringify(config));
    const apiInstance = getApiInstance(config.url || '');
    return apiInstance(config);
  },
  get: (url: string, config?: AxiosRequestConfig) => {
    console.log('[API] GET request to:', url);
    const apiInstance = getApiInstance(url);
    return apiInstance.get(url, config);
  },
  post: (url: string, data?: any, config?: AxiosRequestConfig) => {
    console.log('[API] POST request to:', url);
    console.log('[API] POST data:', JSON.stringify(data));
    const apiInstance = getApiInstance(url);
    return apiInstance.post(url, data, config);
  },
  put: (url: string, data?: any, config?: AxiosRequestConfig) => {
    console.log('[API] PUT request to:', url);
    console.log('[API] PUT data:', JSON.stringify(data));
    const apiInstance = getApiInstance(url);
    return apiInstance.put(url, data, config);
  },
  delete: (url: string, config?: AxiosRequestConfig) => {
    console.log('[API] DELETE request to:', url);
    const apiInstance = getApiInstance(url);
    return apiInstance.delete(url, config);
  },
};

export default api;