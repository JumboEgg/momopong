import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 타입 정의
export type NoticeType = 'invite' | 'system';

export interface BaseNotification {
  id: number;
  image: string;
  timestamp: string;
}

export interface InviteNotification extends BaseNotification {
  type: 'invite';
  senderName: string;
  title: string;
}

export interface SystemNotification extends BaseNotification {
  type: 'system';
  characterName: string;
}

export type NotificationData = InviteNotification | SystemNotification;

// store 인터페이스
interface NotificationStore {
  // 상태
  notifications: NotificationData[];
  isLoading: boolean;
  hasError: boolean;

  // 액션
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: number) => void;
  clearAll: () => void;
}

// 임시 mock 데이터
const mockData: NotificationData[] = [
  {
    id: 1,
    type: 'invite',
    senderName: '인어공주',
    title: '인어공주',
    image: 'https://www.palnews.co.kr/news/photo/201801/92969_25283_5321.jpg',
    timestamp: '2024-01-30T10:00:00Z',
  },
  {
    id: 2,
    type: 'system',
    characterName: '그레텔',
    image: 'https://www.palnews.co.kr/news/photo/201801/92969_25283_5321.jpg',
    timestamp: '2024-01-30T09:00:00Z',
  },
];

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      notifications: mockData,
      isLoading: false,
      hasError: false,

      fetchNotifications: async () => {
        set({ isLoading: true });
        try {
          await new Promise((resolve) => {
            setTimeout(resolve, 500);
          });
          set({
            notifications: mockData,
            isLoading: false,
          });
        } catch (error) {
          set({
            hasError: true,
            isLoading: false,
          });
        }
      },

      markAsRead: (id: number) => {
        set((state) => ({
          notifications: state.notifications.filter(
            (notification) => notification.id !== id,
          ),
        }));
      },

      clearAll: () => {
        set({ notifications: [] });
      },
    }),
    {
      name: 'notification-storage',
      // isLoading과 hasError는 임시 상태이므로 저장하지 않음
      partialize: (state) => ({
        notifications: state.notifications,
      }),
    },
  ),
);
