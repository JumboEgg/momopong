// src/stores/AuthStore.ts
import { create } from 'zustand';
import axios, { InternalAxiosRequestConfig, AxiosHeaders } from 'axios';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  id: number;
  accessToken: string; // JWT 토큰
}

interface AuthState {
  isAuthenticated: boolean;
  userId: number | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
  login: (loginData: LoginRequest) => Promise<void>;
  logout: () => void;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// axios 인터셉터 설정
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

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('accessToken'),
  userId: null,
  accessToken: localStorage.getItem('accessToken'),
  isLoading: false,
  error: null,
  login: async (loginData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post<LoginResponse>('/parents/signup', loginData);
      // JWT 토큰을 로컬 스토리지에 저장
      localStorage.setItem('accessToken', response.data.accessToken);

      set({
        isAuthenticated: true,
        userId: response.data.id,
        accessToken: response.data.accessToken,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: '로그인에 실패했습니다. 다시 시도해주세요.',
      });
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    set({
      isAuthenticated: false,
      userId: null,
      accessToken: null,
      error: null,
    });
  },
}));

export type { LoginRequest };
export default useAuthStore;
