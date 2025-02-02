// 부모 인증 위한 계산 인증 Store
import { create } from 'zustand';

interface ParentAuthStore {
  userInput: string;
  isCorrect: boolean | null;
  numbers: {
    num1: number;
    num2: number;
  };
  // actions
  setUserInput: (value: number) => void;
  clearLastInput: () => void;
  checkAnswer: () => boolean;
  resetAuth: () => void;
}

export const useParentAuthStore = create<ParentAuthStore>((set, get) => ({
  userInput: '',
  isCorrect: null,
  numbers: {
    num1: Math.floor(Math.random() * 9) + 1,
    num2: Math.floor(Math.random() * 9) + 1,
  },

  setUserInput: (value) => set((state) => ({
    userInput: state.userInput.length < 2 ? state.userInput + value : state.userInput,
    isCorrect: null,
  })),

  clearLastInput: () => set((state) => ({
    userInput: state.userInput.slice(0, -1),
    isCorrect: null,
  })),

  checkAnswer: () => {
    const { userInput, numbers } = get();
    const answer = parseInt(userInput, 10);
    const correct = answer === numbers.num1 * numbers.num2;
    set({ isCorrect: correct });
    return correct;
  },

  resetAuth: () => set({
    userInput: '',
    isCorrect: null,
    numbers: {
      num1: Math.floor(Math.random() * 9) + 1,
      num2: Math.floor(Math.random() * 9) + 1,
    },
  }),
}));
