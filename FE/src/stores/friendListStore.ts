// stores/friendListStore.ts
import { create } from 'zustand';
import type { Friend } from '@/types/friend';
import type { FriendInvitation } from '@/types/invitation';
import api from '@/api/axios';
import { tokenService } from '@/services/tokenService';

const sortByOnlineStatus = (friends: Friend[]) => friends.sort((a, b) => {
  if (a.status === 'ONLINE') return -1;
  if (b.status === 'ONLINE') return 1;
  return 0;
});

interface FriendList {
  friends: Friend[];
  selectedFriend: Friend | null;
  loading: boolean;
  error: string | null;
  isConnected: boolean;

  // 기본 액션
  setSelectedFriend: (friend: Friend | null) => void;
  setIsConnected: (state:boolean) => void;
  clearError: () => void;

  // API 액션
  fetchFriends: () => Promise<void>;
  fetchBookFriends: (bookId: number) => Promise<void>;
  inviteFriend: (invitation: FriendInvitation) => Promise<void>;
  updateFriendStatus: (friendId: number, status: Friend['status']) => void;

  // 폴링
  startStatusPolling: () => void;
  stopStatusPolling: () => void;
}

export const useFriendListStore = create<FriendList>()((set) => ({
  // 초기 상태
  friends: [],
  selectedFriend: null,
  loading: false,
  error: null,
  isConnected: false,

  // 기본 액션
  setSelectedFriend: (friend) => set({ selectedFriend: friend }),
  setIsConnected: (state) => set({ isConnected: state }),
  clearError: () => set({ error: null }),

  // API 액션
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

  fetchBookFriends: async (bookId: number) => {
    set({ loading: true, error: null });
    try {
      const currentChildId = tokenService.getCurrentChildId();
      if (!currentChildId) {
        throw new Error('선택된 자녀가 없습니다.');
      }

      const response = await api.get(`/book/${bookId}/friend/${currentChildId}`);
      const sortedFriends = sortByOnlineStatus(response.data);
      set({ friends: sortedFriends, loading: false });
    } catch (error) {
      console.error('Failed to fetch book friends:', error);
      const errorMessage = error instanceof Error ? error.message : '동화 친구 목록을 불러오는데 실패했습니다.';
      set({ error: errorMessage, loading: false });
    }
  },

  inviteFriend: async ({ bookId, inviterId, inviteeId }: FriendInvitation) => {
    set({ loading: true, error: null });
    try {
      await api.post(
        `/book/${bookId}/friend/${inviterId}/invitation`,
        { inviteeId },
      );
    } catch (error) {
      console.error('Failed to invite friend:', error);
      const errorMessage = error instanceof Error ? error.message : '친구 초대에 실패했습니다.';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
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

  // 폴링
  startStatusPolling: () => {
    const pollInterval = setInterval(() => {
      const currentChildId = tokenService.getCurrentChildId();
      if (currentChildId) {
        // 기존의 fetchFriends 재사용
        useFriendListStore.getState().fetchFriends();
      }
    }, 30000); // 30초마다 갱신

    (window as any).friendStatusPolling = pollInterval;
  },
  stopStatusPolling: () => {
    if ((window as any).friendStatusPolling) {
      clearInterval((window as any).friendStatusPolling);
    }
  },
}));

export const useFriendInvitation = () => {
  const {
 inviteFriend, loading, error, clearError,
} = useFriendListStore();

  const handleInvitation = async (bookId: number, inviterId: number, inviteeId: number) => {
    try {
      await inviteFriend({ bookId, inviterId, inviteeId });
    } catch (err) {
      console.error('친구 초대 처리 중 오류:', err);
    }
  };

  return {
    handleInvitation,
    loading,
    error,
    clearError,
  };
};
