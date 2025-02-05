import { create } from 'zustand';
import api from '@/api/axios';
import useAuthStore from '@/stores/authStore';
import type { LoginResponse, LoginRequest } from '@/types/auth';

interface LoginState {
  isLoading: boolean;
  error: string | null;
  login: (loginData: LoginRequest) => Promise<void>;
  logout: () => void;
}

// 로그인 로직엔 당장 중요한 상태 없으므로 persist 하지 않습니다. 정보는 authStore에서 저장됩니다
export const useLoginStore = create<LoginState>((set) => ({
  isLoading: false,
  error: null,
  login: async (loginData: LoginRequest) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post<LoginResponse>('/parents/login', loginData);

      const authStore = useAuthStore.getState();
      authStore.setTokens(response.data.jwtToken);
      authStore.setUser(response.data.parentDto);

      localStorage.setItem('parentId', response.data.parentDto.parentId.toString());

      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: '로그인에 실패했습니다. 다시 시도해주세요.',
      });
      throw error;
    }
  },
  logout: () => {
    useAuthStore.getState().reset();
  },
}));

export default useLoginStore;
export type { LoginState };
