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
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      setTokens: (tokens: JwtToken) => {
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
      partialize: (state) => Object.fromEntries(
        Object.entries(state)
          .filter(([key]) => ['isAuthenticated', 'user', 'accessToken', 'refreshToken']
            .includes(key)),
      ),
    },
  ),
);

export default useAuthStore;
