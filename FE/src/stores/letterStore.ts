import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AxiosError } from 'axios'; // 추후 삭제
import api from '@/api/axios';
import { useSubAccountStore } from '@/stores/subAccountStore';

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
  currentLetter: number;
  isLoading: boolean;
  error: string | null;
  childToken: {
    accessToken: string | null;
  }

  sendLetter: (letter: Letter) => Promise<number>;
  getLetterList: () => Promise<Letter[]>;
  getLetter: (letterId: number) => Promise<Letter>;

  setLetter: (data: Letter) => void;
  setLoading: (status: boolean) => void;
  setError: (error: string | null) => void;
}

const useLetterStore = create<LetterState>()(
  persist(
    (set) => ({
      letters: [],
      currentLetter: null,
      isLoading: false,
      error: null,

      sendLetter: async (letter) => {
        set({ isLoading: true, error: null });

        try {
          const { selectedAccount } = useSubAccountStore.getState();
          if (!selectedAccount) {
            throw new Error('아이 계정 정보를 찾을 수 없습니다.');
          }

          console.log('Sending letter to server: ', letter);
          const response = await api.post<string>(
            `/book/letter/gpt/${selectedAccount.childId}`,
            letter,
          );
          console.log('Server response: ', response);
        } catch (error) {
          // AxiosError 타입 체크
          if (error instanceof AxiosError) {
            console.error('Error response:', {
              status: error.response?.status,
              data: error.response?.data,
              headers: error.response?.headers,
            });
          } else {
            console.error('Non-Axios error:', error);
          }

          const errorMessage = error instanceof Error
            ? error.message
            : '편지 조회 중 오류가 발생했습니다.';
          set({ error: errorMessage, isLoading: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      getLetterList: async () => {
        set({ isLoading: true, error: null });

        try {
          const { selectedAccount } = useSubAccountStore.getState();
          if (!selectedAccount) {
            throw new Error('아이 계정 정보를 찾을 수 없습니다.');
          }

          console.log('Loading Letters from Server');
          const response = await api.get(`/profile/${selectedAccount.childId}/letter`);
          console.log('Server response: ', response);

          set({ letters: response });
        } catch (error) {
          // AxiosError 타입 체크
          if (error instanceof AxiosError) {
            console.error('Error response:', {
              status: error.response?.status,
              data: error.response?.data,
              headers: error.response?.headers,
            });
          } else {
            console.error('Non-Axios error:', error);
          }

          const errorMessage = error instanceof Error
            ? error.message
            : '편지 조회 중 오류가 발생했습니다.';
          set({ error: errorMessage, isLoading: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      getLetter: async (letterId) => {
        set({ isLoading: true, error: null });

        try {
          const { selectedAccount } = useSubAccountStore.getState();
          if (!selectedAccount) {
            throw new Error('아이 계정 정보를 찾을 수 없습니다.');
          }

          console.log('Loading Letter from Server: ', letterId);
          const response = await api.get(`/profile/${selectedAccount.childId}/letter/${letterId}`);
          console.log('Server response: ', response);

          set({ letter: response });
        } catch (error) {
          // AxiosError 타입 체크
          if (error instanceof AxiosError) {
            console.error('Error response:', {
              status: error.response?.status,
              data: error.response?.data,
              headers: error.response?.headers,
            });
          } else {
            console.error('Non-Axios error:', error);
          }

          const errorMessage = error instanceof Error
            ? error.message
            : '편지 조회 중 오류가 발생했습니다.';
          set({ error: errorMessage, isLoading: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      setLetter: (data) => set({ currentLetter: data }),
      setLoading: (status) => set({ isLoading: status }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'letter-storage',
      partialize: (state) => ({
        letterx: state.letters,
        currentLetter: state.currentLetter,
      }),
    },
  ),
);

export default useLetterStore;
