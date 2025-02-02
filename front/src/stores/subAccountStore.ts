import { create } from 'zustand';
import axios from 'axios';

interface SubAccount {
  id: number;
  name: string;
  profile: string;
  birth: string;
  gender: '남자' | '여자';
}

interface CreateSubAccountRequest {
  parentId: number;
  name: string;
  profile: string;
  birth: string;
  gender: '남자' | '여자';
}

interface SubAccountState {
  // 상태
  subAccounts: SubAccount[];
  isLoading: boolean;
  error: string | null;

  // API 액션
  createSubAccount: (data: CreateSubAccountRequest) => Promise<number>;

  // 로컬 상태 관리
  setLoading: (status: boolean) => void;
  setError: (error: string | null) => void;
  addSubAccount: (account: SubAccount) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// get 도 구현해야합니다
const useSubAccountStore = create<SubAccountState>((set) => ({
  // 초기 상태
  subAccounts: [],
  isLoading: false,
  error: null,

  // API 액션
  createSubAccount: async (data: CreateSubAccountRequest) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/children/signup`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
      );

      const newAccount: SubAccount = {
        id: response.data.id,
        name: data.name,
        profile: data.profile,
        birth: data.birth,
        gender: data.gender,
      };

      set((state) => ({
        subAccounts: [...state.subAccounts, newAccount],
        isLoading: false,
      }));

      return response.data.id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '계정 생성 중 오류가 발생했습니다.';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // 로컬 상태 관리 메서드
  setLoading: (status: boolean) => set({ isLoading: status }),
  setError: (error: string | null) => set({ error }),
  addSubAccount: (account: SubAccount) => set((state) => (
    { subAccounts: [...state.subAccounts, account] })),
}));

export default useSubAccountStore;
