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

const parentAuthPaths = [
  '/parents',
  '/children/signup',
  '/children/login',
  '/children/logout',
  '/parents/children',
  '/parents/:parent_id/children',
];

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // console.log('Request Config:', {
  //   url: config.url,
  //   method: config.method,
  //   headers: config.headers ? { ...config.headers } : {},
  // });

  if (publicPaths.includes(config.url || '')) {
    return config;
  }

  const needsParentAuth = parentAuthPaths.some((path) => config.url?.includes(path));
  // console.log('Needs Parent Auth:', needsParentAuth);

  const token = tokenService.getActiveToken(needsParentAuth);
  // console.log('Token being used:', token ? 'Token exists' : 'No token');

  if (!token) return config;

  // AxiosHeaders 인스턴스 생성 및 사용
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
    // console.log('Response Error Details:', {
    //   status: error.response?.status,
    //   data: error.response?.data,
    //   headers: error.config?.headers
    //     ? Object.fromEntries(error.config.headers.entries())
    //     : null,
    //   url: error.config?.url,
    // });

    const originalRequest = error.config as InternalAxiosRequestConfig & { retry?: boolean };

    // 401 아닌 다른 에러는 바로 리턴
    if (error.response?.status !== 401 || originalRequest.retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest.retry = true;
    isRefreshing = true;

    try {
      const refreshToken = tokenService.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post<RefreshResponse>(
        '/parents/refresh-token',
        { refreshToken },
      );

      // 새 토큰 저장
      tokenService.setParentToken(response.data.jwtToken.accessToken);
      tokenService.setRefreshToken(response.data.jwtToken.refreshToken);

      // 자녀 계정 재로그인
      const currentChildId = tokenService.getCurrentChildId();
      if (currentChildId) {
        const childLoginResponse = await api.post(
          '/children/login',
          { childId: currentChildId },
        );
        tokenService.setChildToken(childLoginResponse.data.accessToken);
      }

      // 큐에 있는 요청들 처리
      processQueue();
      return await api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as Error);
      tokenService.clearAllTokens();
      return await Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
