import { create } from 'zustand';
import type { Toast } from '@/types/notification';

interface ToastStore {
  toast: Toast | null;
  showToast: (toast: Toast) => void;
  hideToast: () => void;
}

const useToastStore = create<ToastStore>((set) => ({
  toast: null,
  showToast: (toast) => {
    set({ toast });
    setTimeout(() => {
      set({ toast: null });
    }, 3000);
  },
  hideToast: () => set({ toast: null }),
}));

export default useToastStore;
