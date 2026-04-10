import axios from 'axios';
import { globalToast } from '../context/ToastContext';

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// --- Slow-request toast (cold start Render) ---
const SLOW_REQUEST_THRESHOLD = 3000;

api.interceptors.request.use((config) => {
  config._slowToastId = null;
  config._slowTimer = setTimeout(() => {
    config._slowToastId = globalToast.info(
      'Đang kết nối máy chủ, vui lòng chờ...',
      { autoClose: false }
    );
  }, SLOW_REQUEST_THRESHOLD);
  return config;
});

api.interceptors.response.use(
  (response) => {
    clearTimeout(response.config._slowTimer);
    if (response.config._slowToastId) {
      globalToast.dismiss(response.config._slowToastId);
    }
    return response;
  },
  (error) => {
    clearTimeout(error.config?._slowTimer);
    if (error.config?._slowToastId) {
      globalToast.dismiss(error.config._slowToastId);
    }
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post('/auth/refresh');
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        window.location.href = '/admin/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
