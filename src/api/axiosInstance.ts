import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: '/api', // CHANGED: Ensure all requests go to FastAPI backend
});

// Add a request interceptor to attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      if (!config.headers) config.headers = {} as typeof config.headers;
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
