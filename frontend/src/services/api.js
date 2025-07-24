// src/services/api.js - Improved with less aggressive cancellation
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 15000, // Increased timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Essential for session cookies
});

// Track ongoing requests to prevent excessive duplicates (but allow some)
const ongoingRequests = new Map();
const REQUEST_COOLDOWN = 1000; // 1 second cooldown between identical requests

// Request interceptor with improved duplicate handling
api.interceptors.request.use(
  (config) => {
    // Create request key to identify duplicates
    const requestKey = `${config.method?.toUpperCase()}-${config.url}-${JSON.stringify(config.params || {})}`;
    const now = Date.now();
    
    // Check if we have a recent identical request
    const lastRequest = ongoingRequests.get(requestKey);
    if (lastRequest && (now - lastRequest.timestamp) < REQUEST_COOLDOWN) {
      // Only cancel if it's very recent (within cooldown period)
      console.log(`⏸️ Throttling duplicate request: ${requestKey}`);
      const source = axios.CancelToken.source();
      source.cancel('Duplicate request throttled');
      config.cancelToken = source.token;
    } else {
      // Allow the request and track it
      ongoingRequests.set(requestKey, { timestamp: now });
      
      // Clean up old entries (older than 5 seconds)
      for (const [key, value] of ongoingRequests.entries()) {
        if (now - value.timestamp > 5000) {
          ongoingRequests.delete(key);
        }
      }
    }
    
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      params: config.params,
      withCredentials: config.withCredentials,
      requestKey
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with better error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Success:', {
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
      hasData: !!response.data
    });
    
    return response;
  },
  (error) => {
    // Don't log cancelled requests as errors
    if (axios.isCancel(error)) {
      console.log('⏸️ Request cancelled:', error.message);
      return Promise.reject(error);
    }
    
    console.error('❌ API Error:', {
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      isCancel: false
    });

    // Handle session errors
    if (error.response?.status === 401) {
      console.warn('🔐 Session expired or invalid');
      // Don't redirect immediately, let components handle it
    }
    
    return Promise.reject(error);
  }
);

// Utility to clear request tracking (useful for cleanup)
export const clearRequestTracking = () => {
  console.log('🧹 Clearing request tracking');
  ongoingRequests.clear();
};

export default api;