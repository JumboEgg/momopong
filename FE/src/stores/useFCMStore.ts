import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import axios from 'axios';
import { tokenService } from '@/services/tokenService';

interface FCMState {
  fcmToken: string | null;
  isLoading: boolean;
  error: string | null;
  setFCMToken: (childId: number, token: string) => Promise<void>;
  deleteFCMToken: (childId: number) => Promise<void>;
  clearError: () => void;
}

const api = axios.create({
  baseURL: 'https://i12d103.p.ssafy.io',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useFCMStore = create<FCMState>()(
  devtools((set) => ({
    fcmToken: null,
    isLoading: false,
    error: null,

    setFCMToken: async (childId: number, token: string) => {
      try {
        set({ isLoading: true, error: null });
        const accessToken = tokenService.getAccessToken();

        if (!accessToken) {
          throw new Error('인증 토큰이 없습니다.');
        }

        await api.post(
          '/api/fcm/save-token',
          { childId, token },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        set({ fcmToken: token });
      } catch (error) {
        set({ error: 'FCM 토큰 저장에 실패했습니다.' });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    deleteFCMToken: async (childId: number) => {
      try {
        set({ isLoading: true, error: null });
        const accessToken = tokenService.getAccessToken();

        if (!accessToken) {
          throw new Error('인증 토큰이 없습니다.');
        }

        await api.post(
          '/api/fcm/delete-token',
          { childId },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        set({ fcmToken: null });
      } catch (error) {
        set({ error: 'FCM 토큰 삭제에 실패했습니다.' });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    clearError: () => set({ error: null }),
  })),
);
