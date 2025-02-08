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
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true,
        });
        // tokenService 업데이트
        tokenService.syncWithAuth(tokens);
      },

      setUser: (user: ParentDto) => set({ user }),

      // tokenService 기준으로 업데이트
      setSelectedChildId: (childId: number | null) => {
        set({ selectedChildId: childId });
        tokenService.setCurrentChildId(childId);
      },

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
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        selectedChildId: state.selectedChildId,
      }),
      onRehydrateStorage: () => (state) => {
        // 스토리지에서 상태가 복원된 후 tokenService 초기화
        if (state) {
          tokenService.syncWithAuth({
            accessToken: state.accessToken,
            refreshToken: state.refreshToken,
          });
        }
      },
    },
  ),
);

export default useAuthStore;
