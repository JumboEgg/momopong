import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import api from '@/api/axios';
// import { tokenService } from '@/services/tokenService';

interface FCMState {
  fcmToken: string | null;
  isLoading: boolean;
  error: string | null;
  setFCMToken: (childId: number, token: string) => Promise<void>;
  deleteFCMToken: (childId: number) => Promise<void>;
  clearError: () => void;
}

const useFCMStore = create<FCMState>()(
  devtools((set) => ({
    fcmToken: null,
    isLoading: false,
    error: null,

    setFCMToken: async (childId: number, token: string) => {
      try {
        set({ isLoading: true, error: null });

        await api.post('/api/fcm/save-token', {
          childId,
          token,
        });

        set({ fcmToken: token });
      } catch (error) {
        const errorMessage = error instanceof Error
          ? error.message
          : 'FCM 토큰 저장에 실패했습니다.';
        set({ error: errorMessage });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    deleteFCMToken: async (childId: number) => {
      try {
        set({ isLoading: true, error: null });

        await api.post('/api/fcm/delete-token', {
          childId,
        });

        set({ fcmToken: null });
      } catch (error) {
        const errorMessage = error instanceof Error
          ? error.message
          : 'FCM 토큰 삭제에 실패했습니다.';
        set({ error: errorMessage });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    clearError: () => set({ error: null }),
  })),
);

export default useFCMStore;
