import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// Default AWS/Local API URL
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.runmyshop.z3kventures.com/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle session expirations / global errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto-logout on unauthorized response
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
