import { create } from 'zustand';
import api from '@/api/axios';
import useLoginStore from './loginStore';

interface SubAccount { // 로그인한 서브계정 정보
  childId: number;
  name: string;
  profile: string;
  age: number;
  daysSinceStart: number;
  code: string;
  firstLogin: boolean;
}

interface CreateSubAccountRequest {
  parentId: number;
  name: string;
  profile: string;
  birth: string;
  gender: '남자' | '여자';
}

interface CreateSubAccountResponse {
  id: number; // 서버에서 생성된 자식 계정의 ID만 반환
}

interface SubAccountState {
  // 상태
  subAccounts: SubAccount[];
  selectedAccount: SubAccount | null; // 현재 선택된(로그인된) 자식 계정
  isLoading: boolean;
  error: string | null;

  // 유틸리티
  canAddMore: () => boolean; // 계정 추가 더 가능한지 확인

  // API 액션
  fetchSubAccounts: () => Promise<void>; // GET
  createSubAccount: (data: CreateSubAccountRequest) => Promise<number>; // POST
  loginSubAccount: (childId: number) => Promise<boolean>;

  // 로컬 상태 관리
  setLoading: (status: boolean) => void;
  setError: (error: string | null) => void;
  addSubAccount: (account: SubAccount) => void;

  // 폼 상태
  formData: {
    parentId: number;
    name: string;
    profile: string;
    birth: string;
    gender: '남자' | '여자';
  };

  // 폼 액션
  setFormField: (field: string, value: string | number) => void;
  handleImageChange: (imageUrl: string) => void;
  resetForm: () => void;
}

const useSubAccountStore = create<SubAccountState>((set, get) => ({
  // 초기 상태
  subAccounts: [],
  selectedAccount: null,
  isLoading: false,
  error: null,

  // 폼 초기 상태
  formData: {
    parentId: 0,
    name: '',
    profile: '/images/default-profile.jpg',
    birth: '',
    gender: '남자',
  },

  // API 액션
  fetchSubAccounts: async () => { // 전체 서브계정 조회
    set({ isLoading: true, error: null });

    try {
      const loginStore = useLoginStore.getState();
      const parentId = loginStore.user?.parentId;

      if (!parentId) {
        throw new Error('부모 계정 정보를 찾을 수 없습니다.');
      }

      const response = await api.get(`/api/parents/${parentId}/children`);

      set({
        subAccounts: response.data,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : '계정 목록 조회 중 오류가 발생했습니다.';
      set({ error: errorMessage, isLoading: false });
    }
  },

  createSubAccount: async (data: CreateSubAccountRequest) => { // 서브계정 생성
    const state = get();

    if (!state.canAddMore()) {
      set({ error: '최대 4개의 계정만 생성할 수 있습니다.' });
      throw new Error('최대 계정 수 초과');
    }

    set({ isLoading: true, error: null });

    try {
      const response = await api.post<CreateSubAccountResponse>(
        '/api/children/signup',
        data,
      );

      await get().fetchSubAccounts();

      return response.data.id;
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : '계정 생성 중 오류가 발생했습니다.';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // 자식 계정 로그인
  loginSubAccount: async (childId: number) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post<SubAccount>('/api/children/login', { childId });

      set({
        selectedAccount: response.data,
        isLoading: false,
      });

      // firstLogin이 true인 경우 처리 가능
      return response.data.firstLogin;
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : '로그인 중 오류가 발생했습니다.';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // 유틸리티 메서드
  canAddMore: () => {
    const state = get();
    return state.subAccounts.length < 4;
  },

  // 로컬 상태 관리 메서드
  setLoading: (status: boolean) => set({ isLoading: status }),
  setError: (error: string | null) => set({ error }),
  addSubAccount: (account: SubAccount) => set((state) => (
    { subAccounts: [...state.subAccounts, account] })),

  // 폼 액션
  setFormField: (field: string, value: string | number) => set((state) => ({
    formData: {
      ...state.formData,
      [field]: value,
    },
  })),

  handleImageChange: (imageUrl: string) => set((state) => ({
    formData: {
      ...state.formData,
      profile: imageUrl,
    },
  })),

  resetForm: () => set({
    formData: {
      parentId: 0,
      name: '',
      profile: '/images/default-profile.png',
      birth: '',
      gender: '남자',
    },
  }),
}));

export default useSubAccountStore;
