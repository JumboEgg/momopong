// stores/friendListStore.ts
import { create } from 'zustand';
import type { Friend } from '@/types/friend';
import api from '@/api/axios';
import { tokenService } from '@/services/tokenService';

const sortByOnlineStatus = (friends: Friend[]) => friends.sort((a, b) => {
  if (a.status === 'ONLINE') return -1;
  if (b.status === 'ONLINE') return 1;
  return 0;
});

interface FriendList {
  friends: Friend[];
  loading: boolean;
  error: string | null;
  fetchFriends: () => Promise<void>; // childId 파라미터 제거
  updateFriendStatus: (friendId: number, status: Friend['status']) => void;
}

export const useFriendListStore = create<FriendList>()((set) => ({
  friends: [],
  loading: false,
  error: null,

  fetchFriends: async () => {
    set({ loading: true, error: null });
    try {
      const currentChildId = tokenService.getCurrentChildId();

      if (!currentChildId) {
        throw new Error('선택된 자녀가 없습니다.');
      }

      const response = await api.get(`/children/${currentChildId}/friends`);
      const sortedFriends = sortByOnlineStatus(response.data);
      set({ friends: sortedFriends, loading: false });
    } catch (error) {
      console.error('Failed to fetch friends:', error);
      const errorMessage = error instanceof Error ? error.message : '친구 목록을 불러오는데 실패했습니다.';
      set({ error: errorMessage, loading: false });
    }
  },

  updateFriendStatus: (friendId, status) => {
    set((state) => ({
      friends: sortByOnlineStatus(
        state.friends.map((friend) => (
          friend.childId === friendId ? { ...friend, status } : friend)),
      ),
    }));
  },
}));
