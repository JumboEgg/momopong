import { LetterInfo } from '@/types/letter';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useSubAccountStore from './subAccountStore';

interface LetterState {
  letterList: LetterInfo[];
  selectedLetter: LetterInfo | null;
  isLoading: boolean;
  error: string | null;

  setLetterList: () => void;

  setSelectedLetter: (letter: LetterInfo | null) => void;
  setIsLoading: (status: boolean) => void;
  setError: (error: string | null) => void;
}

const useLetterStore = create<LetterState>()(
  persist(
    (set) => ({
      letterList: [],
      selectedLetter: null,
      isLoading: false,
      error: null,

      setLetterList: async () => {
        try {
          // child token 얻기
          const account = useSubAccountStore.getState().selectedAccount;
          const { accessToken } = useSubAccountStore.getState().childToken;

          if (!accessToken) {
            throw new Error('Failed to get accessToken');
          }

          const response = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/profile/${account?.childId}/letter`,
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

          set({ letterList: data });
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
      name: 'letter-storage',
      partialize: (state) => ({
        letterx: state.letterList,
        selectedLetter: state.selectedLetter,
      }),
    },
  ),
);

export default useLetterStore;
