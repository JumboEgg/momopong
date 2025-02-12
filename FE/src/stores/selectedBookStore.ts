import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useSubAccountStore from '@/stores/subAccountStore';
import { BookContentInfo } from '@/types/book';

interface BookContentStore {
  bookContent: BookContentInfo | null;
  setBookContent: (id: number) => void;
}

const useBookContentStore = create<BookContentStore>()(
  persist(
    (set) => ({
        bookContent: null,
        setBookContent: async (bookId) => {
        try {
          const { accessToken } = useSubAccountStore.getState().childToken;
            const response = await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/book/${bookId}`,
              {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              },
            );

            console.log(response);
            const data = await response.json();
            console.log(data);

            if (!response.ok) {
              throw new Error(`Loading failed: ${response.status}`);
            }

            set({ bookContent: data });
        } catch (error) {
          console.error('Error loading book content:', error);
          throw error;
        }
      },
    }),
    {
      name: 'bookcontent-storage',
      partialize: (state) => ({
        bookContent: state.bookContent,
      }),
    },
  ),
);

export const useBookContent = (): BookContentStore => useBookContentStore();
