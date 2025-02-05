// src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { JwtToken, ParentDto } from '@/types/auth';
import { clearAuthTokens } from '@/utils/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: ParentDto | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  setTokens: (tokens: JwtToken) => void;
  setUser: (user: ParentDto) => void;
  reset: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: !!localStorage.getItem('accessToken'),
      user: null,
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
      isLoading: false,
      error: null,
      setTokens: (tokens: JwtToken) => {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true,
        });
      },
      setUser: (user: ParentDto) => set({ user }),
      reset: () => {
        clearAuthTokens();
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          error: null,
        });
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
);

export default useAuthStore;
