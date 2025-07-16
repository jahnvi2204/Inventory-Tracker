import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Add a request interceptor for auth token if needed
api.interceptors.request.use(
  (config) => {
    // Example: attach token from localStorage if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Do not redirect globally on 401. Let PrivateRoute handle protected route redirects.
    return Promise.reject(error);
  }
);

export default api; 