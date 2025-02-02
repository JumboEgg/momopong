import { create } from 'zustand';
import axios, { InternalAxiosRequestConfig, AxiosHeaders } from 'axios';
import useAuthStore from './LoginStore'; // 로그인 스토어 import

interface SignUpRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
}

interface SignUpFormData {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  phone: string;
}

interface SignUpResponse {
  id: number;
}

interface RegisterState {
  isLoading: boolean;
  error: string | null;
  register: (registerData: SignUpRequest) => Promise<void>;
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

const useSignUpStore = create<RegisterState>((set) => ({
  isLoading: false,
  error: null,
  register: async (registerData) => {
    try {
      set({ isLoading: true, error: null });

      // 1. 회원가입 요청
      await api.post<SignUpResponse>('/parents/signup', registerData);

      // 2. 회원가입 성공 후 로그인 시도
      const { login } = useAuthStore.getState(); // zustand store에서 login 함수 가져오기
      await login({
        email: registerData.email,
        password: registerData.password,
      });

      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: '회원가입에 실패했습니다. 다시 시도해주세요.',
      });
      throw error;
    }
  },
}));

export type { SignUpRequest, SignUpFormData };
export default useSignUpStore;
