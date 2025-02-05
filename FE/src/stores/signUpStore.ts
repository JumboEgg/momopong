import { create } from 'zustand';
import api from '@/api/axios';
import { AxiosError } from 'axios';

interface SignUpRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
}

interface SignUpFormData {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  phone: string;
}

interface SignUpResponse {
  id: number;
}

interface RegisterState {
  isLoading: boolean;
  error: string | null;
  register: (registerData: SignUpRequest) => Promise<{
    success: boolean;
    email: string;
    password: string;
  }>;
}

const useSignUpStore = create<RegisterState>((set) => ({
  isLoading: false,
  error: null,
  register: async (registerData) => {
    try {
      set({ isLoading: true, error: null });

      await api.post<SignUpResponse>('/parents/signup', registerData);
      return { success: true, email: registerData.email, password: registerData.password };
    } catch (error) {
      let errorMessage = '회원가입에 실패했습니다. 다시 시도해주세요.';

      if (error instanceof AxiosError) {
        switch (error.response?.status) {
          case 409:
            errorMessage = '이미 등록된 이메일입니다.';
            break;
          case 400:
            errorMessage = '입력하신 정보를 확인해주세요.';
            break;
          case 500:
            errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
            break;
          default:
            errorMessage = '알 수 없는 오류가 발생했습니다. 고객센터에 문의해주세요.';
            break;
        }
      }

      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export type { SignUpRequest, SignUpFormData };
export default useSignUpStore;
