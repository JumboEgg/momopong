// src/api/axios.ts
import axios, {
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosHeaders,
} from 'axios';
import useAuthStore from '@/stores/authStore';
import type { RefreshResponse } from '@/types/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (!token) return config;

  const headers = new AxiosHeaders(config.headers);
  headers.set('Authorization', `Bearer ${token}`);

  return {
    ...config,
    headers,
  };
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: Error | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { retry?: boolean };

    if (error.response?.status === 401 && !originalRequest.retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest.retry = true;
      isRefreshing = true;

      const { refreshToken } = useAuthStore.getState();
      if (!refreshToken) {
        useAuthStore.getState().reset();
        return Promise.reject(error);
      }

      try {
        const response = await api.post<RefreshResponse>('/parents/refresh-token', { refreshToken });
        useAuthStore.getState().setTokens(response.data.jwtToken);

        processQueue();
        return await api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error);
        useAuthStore.getState().reset();
        return await Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
