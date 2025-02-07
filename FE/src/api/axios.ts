import axios, {
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosHeaders,
} from 'axios';
import type { RefreshResponse } from '@/types/auth';
import { tokenService } from '@/services/tokenService';

const publicPaths = [
  '/parents/signup',
  '/parents/signin',
  '/parents/refresh-token',
  '/children/presigned-url',
];

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (publicPaths.includes(config.url || '')) {
    return config;
  }

  const token = tokenService.getActiveToken();
  if (!token) return config;

  const headers = new AxiosHeaders(config.headers);
  headers.set('Authorization', `Bearer ${token}`);

  return { ...config, headers };
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

      const refreshToken = tokenService.getRefreshToken();
      const currentChildId = tokenService.getCurrentChildId();

      if (!refreshToken) {
        tokenService.clearAllTokens();
        return Promise.reject(error);
      }

      try {
        const response = await api.post<RefreshResponse>('/parents/refresh-token', { refreshToken });
        tokenService.setParentToken(response.data.jwtToken.accessToken);
        tokenService.setRefreshToken(response.data.jwtToken.refreshToken);

        // 자녀 계정이 활성화되어 있었다면 재로그인
        if (currentChildId) {
          const childLoginResponse = await api.post('/children/login', { childId: currentChildId });
          tokenService.setChildToken(childLoginResponse.data.accessToken);
        }

        processQueue();
        return await api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error);
        tokenService.clearAllTokens();
        return await Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
