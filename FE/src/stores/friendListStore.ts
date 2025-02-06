// 리스트 조회 및 친구 상태
import { create } from 'zustand';
import axios from 'axios';
import { Friend } from '@/types/friend';

const sortByOnlineStatus = (friends: Friend[]) => friends.sort((a, b) => {
  if (a.status === 'ONLINE') return -1;
  if (b.status === 'ONLINE') return 1;
  return 0;
});

interface FriendList {
  friends: Friend[];
  loading: boolean;
  error: string | null;

  fetchFriends: () => Promise<void>;
  updateFriendStatus: (friendId: number, status: Friend['status']) => void;
}
export const useFriendListStore = create<FriendList>()((set) => ({
  friends: [],
  loading: false,
  error: null,

  fetchFriends: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('/children/:child_id/friends');
      const sortedFriends = sortByOnlineStatus(response.data);
      set({ friends: sortedFriends, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch friends', loading: false });
    }
  },

  updateFriendStatus: (friendId, status) => {
    set((state) => ({
      friends: sortByOnlineStatus(
        state.friends
          .map((friend) => (friend.childId === friendId ? { ...friend, status } : friend)),
      ),
    }));
  },
}));
