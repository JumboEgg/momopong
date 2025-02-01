import { create } from 'zustand';

type AuthState = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
};

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  login: (username, password) => {
    // 임시 로그인 로직 (백엔드 API가 없으므로 임시로 처리)
    if (username === 'user' && password === 'password') {
      set({ isAuthenticated: true });
    } else {
      alert('Invalid credentials');
    }
  },
  logout: () => set({ isAuthenticated: false }),
}));

export default useAuthStore;
