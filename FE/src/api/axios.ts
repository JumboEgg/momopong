import axios, { InternalAxiosRequestConfig, AxiosHeaders } from 'axios';
import { clearAuthTokens, clearChildTokens } from '@/utils/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken');
  if (!token) return config;

  const headers = new AxiosHeaders(config.headers);
  headers.set('Authorization', `Bearer ${token}`);

  return {
    ...config,
    headers,
  };
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest.retry) {
      originalRequest.retry = true;

      const isChildEndpoint = originalRequest.url?.includes('/children/');
      const refreshToken = isChildEndpoint
        ? localStorage.getItem('childRefreshToken')
        : localStorage.getItem('refreshToken');

      try {
        const response = await api.post('/auth/refresh', { refreshToken });
        const { accessToken } = response.data;

        // 토큰 저장
        if (isChildEndpoint) {
          localStorage.setItem('childAccessToken', accessToken);
        } else {
          localStorage.setItem('accessToken', accessToken);
        }

        // 헤더 업데이트
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return await api(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 시 해당 계정 로그아웃
        if (isChildEndpoint) {
          clearChildTokens();
        } else {
          clearAuthTokens();
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
export default api;
