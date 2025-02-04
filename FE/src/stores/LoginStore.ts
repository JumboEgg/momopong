import { create } from 'zustand';
import { InternalAxiosRequestConfig, AxiosHeaders } from 'axios';
import api from '@/api/axios';

interface LoginRequest {
  email: string;
  password: string;
}

interface ParentDto {
  parentId: number;
  email: string;
  name: string;
  phone: string;
}

interface JwtToken {
  grantType: string;
  accessToken: string;
  refreshToken: string;
}

interface LoginResponse {
  parentDto: ParentDto; // 부모 계정 정보
  jwtToken: JwtToken; // 토큰 정보
}

interface AuthState {
  isAuthenticated: boolean;
  user: ParentDto | null; // userId 대신 전체 사용자 정보 저장
  accessToken: string | null;
  refreshToken: string | null; // refresh 토큰 추가
  isLoading: boolean;
  error: string | null;
  login: (loginData: LoginRequest) => Promise<void>;
  logout: () => void;
}

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

const useLoginStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('accessToken'),
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isLoading: false,
  error: null,
  login: async (loginData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post<LoginResponse>('/parents/login', loginData);

      // JWT 토큰들을 로컬 스토리지에 저장
      localStorage.setItem('accessToken', response.data.jwtToken.accessToken);
      localStorage.setItem('refreshToken', response.data.jwtToken.refreshToken);

      set({
        isAuthenticated: true,
        user: response.data.parentDto, // user 설정
        accessToken: response.data.jwtToken.accessToken,
        refreshToken: response.data.jwtToken.refreshToken,
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
    localStorage.removeItem('refreshToken');
    set({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      error: null,
    });
  },
}));

export type { LoginRequest };
export default useLoginStore;
