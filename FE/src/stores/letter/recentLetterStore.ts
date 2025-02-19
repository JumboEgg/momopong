import { LetterData } from '@/types/letter';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useSubAccountStore from '../subAccountStore';

interface RecentLetterState {
  recentLetterList: LetterData[];
  selectedLetter: LetterData | null;
  isLoading: boolean;
  error: string | null;

  setRecentLetterList: () => void;

  setSelectedLetter: (letter: LetterData | null) => void;
  setIsLoading: (status: boolean) => void;
  setError: (error: string | null) => void;
}

const useRecentLetterStore = create<RecentLetterState>()(
  persist(
    (set) => ({
      recentLetterList: [],
      selectedLetter: null,
      isLoading: false,
      error: null,

      setRecentLetterList: async () => {
        try {
          // child token 얻기
          const account = useSubAccountStore.getState().selectedAccount;
          const { accessToken } = useSubAccountStore.getState().childToken;

          if (!accessToken) {
            throw new Error('Failed to get accessToken');
          }

          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/letter/today/${account?.childId}`,
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

          set({ recentLetterList: data });
        } catch (error) {
          console.error('Error uploading image:', error);
          throw error;
        }
      },

      setSelectedLetter: (letter) => set({ selectedLetter: letter }),
      setIsLoading: (status) => set({ isLoading: status }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'recentLetter-storage',
      partialize: (state) => ({
        letterx: state.recentLetterList,
        selectedLetter: state.selectedLetter,
      }),
    },
  ),
);

export default useRecentLetterStore;
