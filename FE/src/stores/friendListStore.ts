// stores/friendListStore.ts
import { create } from 'zustand';
import type { Friend } from '@/types/friend';
import api from '@/api/axios';

const sortByOnlineStatus = (friends: Friend[]) => friends.sort((a, b) => {
  if (a.status === 'ONLINE') return -1;
  if (b.status === 'ONLINE') return 1;
  return 0;
});

interface FriendList {
  friends: Friend[];
  loading: boolean;
  error: string | null;
  fetchFriends: (childId: number) => Promise<void>;
  updateFriendStatus: (friendId: number, status: Friend['status']) => void;
}

export const useFriendListStore = create<FriendList>()((set) => ({
  friends: [],
  loading: false,
  error: null,

  fetchFriends: async (childId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/children/${childId}/friends`);
      const sortedFriends = sortByOnlineStatus(response.data);
      set({ friends: sortedFriends, loading: false });
    } catch (error) {
      console.error('Failed to fetch friends:', error);
      set({ error: '친구 목록을 불러오는데 실패했습니다.', loading: false });
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
