import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AxiosError } from 'axios'; // 추후 삭제
import api from '@/api/axios';
import { tokenService } from '@/services/tokenService';
import useAuthStore from './authStore';

interface SubAccount {
  childId: number;
  name: string;
  profile: string;
  age: number;
  daysSinceStart: number;
  code: string;
  firstLogin: boolean;
}

interface ChildLoginResponse {
  childDto: SubAccount;
  accessToken: string;
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
  childToken: {
    accessToken: string | null;
  }
  previewImage: string | null; // 미리보기 URL

  // 유틸리티
  canAddMore: () => boolean; // 계정 추가 더 가능한지 확인

  // API 액션
  fetchSubAccounts: () => Promise<void>; // GET
  createSubAccount: (data: CreateSubAccountRequest) => Promise<number>; // POST
  loginSubAccount: (childId: number) => Promise<boolean>;
  logoutSubAccount: () => void;
  uploadProfileImage: (file: File) => Promise<string>;

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

const useSubAccountStore = create<SubAccountState>()(
  persist(
    (set, get) => ({
    // 초기 상태
      subAccounts: [],
      selectedAccount: null,
      isLoading: false,
      error: null,
      childToken: {
        accessToken: null,
      },
      previewImage: null,

      // 폼 초기 상태
      formData: {
        parentId: 0,
        name: '',
        profile: '/images/default-profile.jpg',
        birth: '',
        gender: '남자',
      },

      // API 액션
      fetchSubAccounts: async () => {
        set({ isLoading: true, error: null });

        try {
          const childToken = tokenService.getChildToken();
          console.log('Child Token:', childToken);

          if (childToken) {
            useAuthStore.getState().setSelectedChildId(null);
          }

          const { user } = useAuthStore.getState();
          console.log('Current User:', user);

          if (!user?.parentId) {
            throw new Error('부모 계정 정보를 찾을 수 없습니다.');
          }

          const parentToken = tokenService.getActiveToken(true);
          console.log('Parent Token for request:', parentToken);

          const response = await api.get(`/parents/${user.parentId}/children`);
          console.log('API Response:', response.data);

          // 데이터 설정과 함께 로딩 상태 false로 변경
          set({
            subAccounts: response.data,
            isLoading: false, // 여기에 추가
          });

          // 자녀 계정 복귀 로직이 있다면 여기서 실행
          if (childToken) {
            const { selectedAccount } = get();
            if (selectedAccount) {
              useAuthStore.getState().setSelectedChildId(selectedAccount.childId);
            }
          }
        } catch (error) {
          const errorMessage = error instanceof Error
            ? error.message
            : '계정 목록 조회 중 오류가 발생했습니다.';
          set({
            error: errorMessage,
            isLoading: false, // 에러 발생시에도 로딩 상태 false로 변경
          });
        }
      },

      createSubAccount: async (data: CreateSubAccountRequest) => {
        const state = get();

        if (!state.canAddMore()) {
          set({ error: '최대 4개의 계정만 생성할 수 있습니다.' });
          throw new Error('최대 계정 수 초과');
        }

        set({ isLoading: true, error: null });

        try {
          console.log('Sending data to server:', data);

          const response = await api.post<CreateSubAccountResponse>(
            '/children/signup',
            data,
          );

          console.log('Server response:', response);

          await get().fetchSubAccounts();
          return response.data.id;
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
            : '계정 생성 중 오류가 발생했습니다.';
          set({ error: errorMessage, isLoading: false });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      uploadProfileImage: async (file: File) => {
        set({ isLoading: true, error: null });

        // 미리보기 URL 생성
        const previewUrl = URL.createObjectURL(file);
        set({ previewImage: previewUrl });

        try {
          // 1. 이미지 처리
          const imageBlob: Blob = await new Promise((resolve, reject) => {
            const rawImage = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
              reject(new Error('2d context not supported'));
              return;
            }

            rawImage.onload = () => {
              let { width } = rawImage;
              let { height } = rawImage;
              const MAX_WIDTH = 1024;
              const MAX_HEIGHT = 1024;

              if (width > height && width > MAX_WIDTH) {
                height = Math.round(height * (MAX_WIDTH / width));
                width = MAX_WIDTH;
              } else if (height > MAX_HEIGHT) {
                width = Math.round(width * (MAX_HEIGHT / height));
                height = MAX_HEIGHT;
              }

              canvas.width = width;
              canvas.height = height;
              ctx.drawImage(rawImage, 0, 0, width, height);

              canvas.toBlob(
                (blob) => {
                  if (blob) {
                    URL.revokeObjectURL(rawImage.src);
                    resolve(blob);
                  } else {
                    reject(new Error('WebP 변환 실패'));
                  }
                },
                'image/webp',
                0.8,
              );
            };

            rawImage.onerror = () => {
              URL.revokeObjectURL(rawImage.src);
              reject(new Error('이미지 로드 실패'));
            };

            rawImage.src = URL.createObjectURL(file);
          });

          // 2. Presigned URL 요청
          const presignedResponse = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/children/presigned-url`,
            {
              method: 'GET',
            },
          );

          if (!presignedResponse.ok) {
            throw new Error(`HTTP error! status: ${presignedResponse.status}`);
          }

          const data = await presignedResponse.json();

          // 3. S3 업로드
          const uploadResponse = await fetch(data.presignedUrl, {
            method: 'PUT',
            body: imageBlob,
            headers: {
              'Content-Type': 'image/webp',
            },
          });

          if (!uploadResponse.ok) {
            throw new Error(`Upload failed: ${uploadResponse.status}`);
          }

          return data.fileName;
        } catch (error) {
          // 에러 발생 시 미리보기 제거
          URL.revokeObjectURL(previewUrl);
          set({ previewImage: null });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      setPreviewImage: (url: string | null) => set({ previewImage: url }),

      // 자식 계정 로그인
      // 중복로그인 방지 생각해보기
      loginSubAccount: async (childId: number) => {
        set({ isLoading: true, error: null });

        try {
          const response = await api.post<ChildLoginResponse>(
            '/children/login',
            { childId },
          );

          const { childDto, accessToken } = response.data;

          // tokenService 업데이트를 먼저 수행
          tokenService.setChildToken(accessToken);
          tokenService.setCurrentChildId(childDto.childId);

          set({
            selectedAccount: childDto,
            childToken: { accessToken },
            isLoading: false,
          });

          useAuthStore.getState().setSelectedChildId(childDto.childId);

          return childDto.firstLogin;
        } catch (error) {
          const errorMessage = error instanceof Error
            ? error.message
            : '로그인 중 오류가 발생했습니다.';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      // 자식 계정 로그아웃
      logoutSubAccount: async () => {
        try {
          const { selectedAccount } = get();
          if (selectedAccount?.childId) {
            const token = tokenService.getActiveToken(true);
            console.log('Logout 요청 전 토큰:', token);
            console.log('Logout 요청 childId:', selectedAccount.childId);

            const response = await api.post('/children/logout', {
              childId: selectedAccount.childId.toString(),
            });

            console.log('Logout 응답:', response);
          }

          // tokenService 초기화
          tokenService.setChildToken(null);
          tokenService.setCurrentChildId(null);

          // 현재 선택된 계정과 토큰 정보만 초기화
          set({
            selectedAccount: null,
            childToken: { accessToken: null },
          });

          useAuthStore.getState().setSelectedChildId(null);
        } catch (error: any) { // AxiosError 타입 명시
          console.error('Logout 에러 상세:', {
            status: error?.response?.status,
            data: error?.response?.data,
            headers: error?.config?.headers,
          });

          // 에러가 발생하더라도 로컬 상태는 초기화
          set({
            selectedAccount: null,
            childToken: { accessToken: null },
          });
          useAuthStore.getState().setSelectedChildId(null);
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
    }),
    {
      name: 'subaccount-storage',
      partialize: (state) => ({
        subAccounts: state.subAccounts,
        selectedAccount: state.selectedAccount,
        childToken: state.childToken,
      }),
      // onRehydrateStorage 추가
      onRehydrateStorage: () => (state) => {
        if (state) {
          // 스토리지에서 복원된 상태로 tokenService 초기화
          if (state.selectedAccount && state.childToken.accessToken) {
            tokenService.setChildToken(state.childToken.accessToken);
            tokenService.setCurrentChildId(state.selectedAccount.childId);
          }
        }
      },
    },
  ),
);

export default useSubAccountStore;
