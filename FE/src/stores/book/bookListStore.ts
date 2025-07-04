import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useSubAccountStore from '@/stores/subAccountStore';
import { BookItemInfo } from '@/types/book';

interface BookListStore {
  bookList: BookItemInfo[];
  setBookList: () => void;
}

const useBookListStore = create<BookListStore>()(
  persist(
    (set) => ({
      bookList: [],
      setBookList: async () => {
        try {
          const { accessToken } = useSubAccountStore.getState().childToken;
            const response = await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/book`,
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

            set({ bookList: data });
        } catch (error) {
          console.error('Error uploading image:', error);
          throw error;
        }
      },
    }),
    {
      name: 'booklist-storage',
      partialize: (state) => ({
        sketch: state.bookList,
      }),
    },
  ),
);

export const useBookList = (): BookListStore => useBookListStore();
