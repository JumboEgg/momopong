import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Letter {
  bookTitle: string;
  role: string;
  childName: string | null;
  content: string;
  letterRecord: string;
  reply: string | null;
  createdAt: string;
}

interface LetterState {
  letters: Letter[];
  selectedLetter: Letter | null;
  isLoading: boolean;
  error: string | null;

  setLetters: (letters: Letter[]) => void;

  setSelectedLetter: (letter: Letter) => void;
  setIsLoading: (status: boolean) => void;
  setError: (error: string | null) => void;
}

const useLetterStore = create<LetterState>()(
  persist(
    (set) => ({
      letters: [],
      selectedLetter: null,
      isLoading: false,
      error: null,

      setLetters: (letters) => set({ letters }),

      setSelectedLetter: (idx) => set({ selectedLetter: idx }),
      setIsLoading: (status) => set({ isLoading: status }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'letter-storage',
      partialize: (state) => ({
        letterx: state.letters,
        selectedLetter: state.selectedLetter,
      }),
    },
  ),
);

export default useLetterStore;
