import { FrameInfo } from '@/types/frame';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useSubAccountStore from './subAccountStore';

// Drawing 상태 관리 스토어
interface DrawingHistoryStore {
  drawingList: FrameInfo[];
  setDrawingList: () => void;
}

// Zustand 상태 훅 생성
const useDrawingHistoryStore = create<DrawingHistoryStore>()(
  persist(
    (set) => ({
      drawingList: [],
      setDrawingList: async () => {
        try {
            // child token 얻기
            const { accessToken } = useSubAccountStore.getState().childToken;
            const account = useSubAccountStore.getState().selectedAccount;

            if (!accessToken) {
              throw new Error('Failed to get accessToken');
            }

            const response = await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/profile/${account?.childId}/frame`,
              {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              },
            );

            if (!response.ok) {
              throw new Error(`Upload failed: ${response.status}`);
            }

            const data = await response.json();

            set({ drawingList: data });
          } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
          }
      },
    }),
    {
      name: 'drawing-storage',
      partialize: (state) => Object.fromEntries(
        Object.entries(state)
          .filter(([key]) => ['drawingList']
            .includes(key)),
      ),
    },
  ),
);

// Zustand에서 상태를 가져오는 커스텀 훅
export const useDrawingHistory = (): DrawingHistoryStore => useDrawingHistoryStore();
