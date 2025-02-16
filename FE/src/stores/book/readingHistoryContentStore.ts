import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useSubAccountStore from '@/stores/subAccountStore';
import { BookContentInfo } from '@/types/book';

interface ReadingHistoryContentStore {
  readingHistoryContent: BookContentInfo | null;
  setReadingHistoryContent: (id: number) => void;
}

const useReadingHistoryContentStore = create<ReadingHistoryContentStore>()(
  persist(
    (set) => ({
        readingHistoryContent: null,
        setReadingHistoryContent: async (bookId) => {
        try {
          const { accessToken } = useSubAccountStore.getState().childToken;
          const account = useSubAccountStore.getState().selectedAccount;

            const response = await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/profile/${account?.childId}/book/${bookId}`,
              {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              },
            );

            if (!response.ok) {
              throw new Error(`Loading failed: ${response.status}`);
            }
            const data = await response.json();

            console.log(data);

            set({ readingHistoryContent: data });
        } catch (error) {
          console.error('Error loading book content:', error);
          throw error;
        }
      },
    }),
    {
      name: 'reading-history-content-storage',
      partialize: (state) => ({
        bookContent: state.readingHistoryContent,
      }),
    },
  ),
);

export const useReadingHistoryContent = ():
ReadingHistoryContentStore => useReadingHistoryContentStore();
