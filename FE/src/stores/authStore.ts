// src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { JwtToken, ParentDto } from '@/types/auth';
import { clearAuthTokens } from '@/utils/auth';
import { tokenService } from '@/services/tokenService';

interface AuthState {
  isAuthenticated: boolean;
  user: ParentDto | null;
  accessToken: string | null; // 부모 accessToken
  refreshToken: string | null;
  selectedChildId: number | null;
  isLoading: boolean;
  error: string | null;
  setTokens: (tokens: JwtToken) => void;
  setUser: (user: ParentDto) => void;
  setSelectedChildId: (childId: number | null) => void;
  reset: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      selectedChildId: null,
      isLoading: false,
      error: null,

      setTokens: (tokens: JwtToken) => {
        tokenService.setParentToken(tokens.accessToken);
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true,
        });
      },

      setUser: (user: ParentDto) => set({ user }),

      setSelectedChildId: (childId: number | null) => set({ selectedChildId: childId }),

      reset: () => {
        clearAuthTokens();
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          selectedChildId: null,
          error: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => Object.fromEntries(
        Object.entries(state)
          .filter(([key]) => ['isAuthenticated', 'user', 'accessToken', 'refreshToken', 'selectedChildId']
            .includes(key)),
      ),
    },
  ),
);

export default useAuthStore;
