import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { JwtToken, ParentDto } from '@/types/auth';
import { clearAuthTokens } from '@/utils/auth';
import { tokenService } from '@/services/tokenService';

// 추후 시간이 있다면 user 정보를 주석 처리한 요소들로 변경하여 민감한 정보는 스토리지에 저장하지 않도록 합니다
interface AuthState {
  isAuthenticated: boolean;
  user: ParentDto | null;
  // parentId: number | null; // 전체 user 객체 대신 ID만 저장
  // parentName: string | null; // 화면 표시용으로만 필요한 경우
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
      // parentId: null,
      // parentName: null,
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

      setUser: (user: ParentDto) => set({
        user,
        // parentId: user.parentId,
        // parentName: user.name, // 필요한 경우에만
      }),

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
          // parentId: null,
          // parentName: null,
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
        // parentId: state.parentId,
        // parentName: state.parentName,
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
