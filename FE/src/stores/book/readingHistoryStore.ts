import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BookItemInfo } from '@/types/book';
import useSubAccountStore from '../subAccountStore';

// Drawing 상태 관리 스토어
interface ReadingHistoryStore {
  readingList: BookItemInfo[];
  setReadingList: () => void;
}

// Zustand 상태 훅 생성
const useReadingHistoryStore = create<ReadingHistoryStore>()(
  persist(
    (set) => ({
      readingList: [],
      setReadingList: async () => {
        // TODO : 읽기 기록 조회 기능 연결
        // 현재 API 미연결 상태
        try {
            // child token 얻기
            const { accessToken } = useSubAccountStore.getState().childToken;
            const account = useSubAccountStore.getState().selectedAccount;

            if (!accessToken) {
              throw new Error('Failed to get accessToken');
            }

            const response = await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/profile/${account?.childId}/book`,
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

            set({ readingList: data });
          } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
          }
      },
    }),
    {
      name: 'reading-history-storage',
      partialize: (state) => ({
        readingList: state.readingList,
      }),
    },
  ),
);

// Zustand에서 상태를 가져오는 커스텀 훅
export const useReadingHistory = (): ReadingHistoryStore => useReadingHistoryStore();
