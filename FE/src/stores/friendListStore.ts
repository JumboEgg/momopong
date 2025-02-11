// stores/friendListStore.ts
import { create } from 'zustand';
import type { Friend } from '@/types/friend';
import type { FriendInvitation } from '@/types/invitation';
import api from '@/api/axios';
import { tokenService } from '@/services/tokenService';
import useToastStore from './toastStore';
import { useRoleStore, type StoryRole, STORY_ROLES } from './roleStore';

const sortByOnlineStatus = (friends: Friend[]) => friends.sort((a, b) => {
  if (a.status === 'ONLINE') return -1;
  if (b.status === 'ONLINE') return 1;
  return 0;
});

const assignRandomRoles = (): [StoryRole, StoryRole] => {
  const roles = [STORY_ROLES.PRINCESS, STORY_ROLES.PRINCE];
  const randomIndex = Math.floor(Math.random() * roles.length);
  return [
    roles[randomIndex],
    roles[(randomIndex + 1) % roles.length],
  ];
};

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
  acceptInvitation: (bookId: number, inviteeId: number, inviterId: number) => Promise<void>;
  rejectInvitation: (bookId: number, inviteeId: number, inviterId: number) => Promise<void>;
  expireInvitation: (bookId: number, inviteeId: number, inviterId: number) => Promise<void>;
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
    const { showToast } = useToastStore.getState();
    const { setRoles } = useRoleStore.getState();
    set({ loading: true, error: null });

    try {
      const [inviterRole, inviteeRole] = assignRandomRoles();

      setRoles(inviterRole, inviteeRole, bookId);

      await api.post(
        `/book/${bookId}/friend/${inviterId}/invitation`,
        {
          inviteeId,
          roleInfo: {
            inviterRole,
            inviteeRole,
          },
          notificationType: 'INVITATION', // 추가
          contentType: 'BOOK', // 추가
        },
      );

      showToast({
        type: 'success',
        message: '친구에게 초대장을 보냈어요!',
      });
    } catch (error) {
      console.error('Failed to invite friend:', error);
      const errorMessage = error instanceof Error ? error.message : '친구 초대에 실패했습니다.';
      set({ error: errorMessage });
      showToast({
        type: 'error',
        message: '초대장을 보내지 못했어요',
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // friendListStore.ts
  acceptInvitation: async (bookId, inviteeId, inviterId) => {
    const { showToast } = useToastStore.getState();
    const roleState = useRoleStore.getState(); // 추가: roleState 가져오기

    try {
      const response = await api.post(`/book/${bookId}/friend/${inviteeId}/invitation/accept`, {
        inviterId,
        roleInfo: {
          inviterRole: roleState.inviterRole,
          inviteeRole: roleState.inviteeRole,
        },
        notificationType: 'ACCEPT',
        contentType: 'BOOK',
      });

      console.log('Accept invitation response:', response.data);

      showToast({
        type: 'success',
        message: '친구와 만나러 가고 있어요',
      });
    } catch (error) {
      console.error('Failed to accept invitation:', error);
      showToast({
        type: 'error',
        message: '지금은 함께 여행할 수 없어요',
      });
    }
  },

  rejectInvitation: async (bookId, inviteeId, inviterId) => {
    const { showToast } = useToastStore.getState();

    try {
      const response = await api.post(`/book/${bookId}/friend/${inviteeId}/invitation/reject`, {
        inviterId,
        notificationType: 'REJECT',
        contentType: 'BOOK',
      });

      console.log('Reject invitation response:', response.data);

      showToast({
        type: 'reject',
        message: '다음에 여행하기로 했어요',
      });
    } catch (error) {
      console.error('Failed to reject invitation:', error);
      showToast({
        type: 'error',
        message: '답장을 보내지 못했어요',
      });
    }
  },

  expireInvitation: async (bookId, inviteeId, inviterId) => {
    const { showToast } = useToastStore.getState();

    try {
      await api.post(`/book/${bookId}/friend/${inviteeId}/invitation/expire`, {
        inviterId,
      });

      showToast({
        type: 'reject',
        message: '초대가 만료되었습니다.',
      });
    } catch (error) {
      console.error('Failed to expire invitation:', error);
      showToast({
        type: 'error',
        message: '초대 만료 처리 중 오류가 발생했습니다.',
      });
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
