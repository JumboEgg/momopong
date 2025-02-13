// stores/friendListStore.ts
import { create } from 'zustand';
import type { Friend } from '@/types/friend';
import type { ContentType, FriendInvitation } from '@/types/invitation';
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

const getInvitationEndpoint = (
  contentType: ContentType,
  contentId: number,
  invitation: FriendInvitation,
  action: 'invitation' | 'accept' | 'reject' | 'expire',
) => {
  const basePath = contentType === 'SKETCH' ? '/sketch' : '/book';
  // inviter / invitee 아이디 정하는 부분
  const userId = action === 'invitation' ? invitation.inviterId : invitation.inviteeId;

  const endpoint = `${basePath}/${contentId}/friend/${userId}/invitation${action !== 'invitation' ? `/${action}` : ''}`;

  console.log('Generated Endpoint:', {
    action,
    contentType,
    contentId,
    userId,
    endpoint,
    invitation,
  });

  return endpoint;
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
  fetchOnlineFriends: (contentId: number, contentType: ContentType) => Promise<void>;
  inviteFriend: (invitation: FriendInvitation) => Promise<void>;
  acceptInvitation:(invitation: FriendInvitation) => Promise<void>;
  rejectInvitation: (invitation: FriendInvitation) => Promise<void>;
  expireInvitation: (invitation: FriendInvitation) => Promise<void>;
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

  fetchOnlineFriends: async (contentId: number, contentType: ContentType) => {
    set({ loading: true, error: null });
    try {
      const currentChildId = tokenService.getCurrentChildId();
      if (!currentChildId) {
        throw new Error('선택된 자녀가 없습니다.');
      }

      const endpoint = contentType === 'SKETCH'
        ? `/sketch/${contentId}/friend/${currentChildId}`
        : `/book/${contentId}/friend/${currentChildId}`;

      const response = await api.get(endpoint);
      const sortedFriends = sortByOnlineStatus(response.data);
      set({ friends: sortedFriends, loading: false });
    } catch (error) {
      console.error('Failed to fetch online friends:', error);
      const errorMessage = error instanceof Error
        ? error.message
        : '온라인 친구 목록을 불러오는데 실패했습니다.';
      set({ error: errorMessage, loading: false });
    }
  },

  inviteFriend: async (invitation: FriendInvitation) => {
    const toastStore = useToastStore.getState();
    const roleStore = useRoleStore.getState();
    set({ loading: true, error: null });

    try {
      const endpoint = getInvitationEndpoint(
        invitation.contentType,
        invitation.contentId,
        invitation,
        'invitation',
      );

      const payload = {
        inviteeId: invitation.inviteeId,
      };

      // BOOK일 경우 프론트엔드에서 role 상태 관리
      if (invitation.contentType === 'BOOK') {
        const [inviterRole, inviteeRole] = assignRandomRoles();
        roleStore.setRoles(inviterRole, inviteeRole, invitation.contentId);
      }

      await api.post(endpoint, payload);

      toastStore.showToast({
        type: 'success',
        message: invitation.contentType === 'BOOK'
          ? '친구에게 여행 초대장을 보냈어요!'
          : '친구에게 함께 그릴지 물어볼게요!',
      });
    } catch (error) {
      console.error('Failed to invite friend:', error);
      const errorMessage = error instanceof Error ? error.message : '친구 초대에 실패했습니다.';
      set({ error: errorMessage });
      toastStore.showToast({
        type: 'error',
        message: '초대장을 보내지 못했어요',
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  acceptInvitation: async (invitation: FriendInvitation) => {
    const toastStore = useToastStore.getState();
    const roleStore = useRoleStore.getState();

    try {
      const endpoint = getInvitationEndpoint(
        invitation.contentType,
        invitation.contentId,
        invitation,
        'accept',
      );

      const payload = {
        inviterId: invitation.inviterId, // inviteeId -> inviterId로 수정
      };

      if (invitation.contentType === 'BOOK') {
        const [inviterRole, inviteeRole] = assignRandomRoles();
        roleStore.setRoles(inviterRole, inviteeRole, invitation.contentId);
      }

      console.log('Accept invitation request:', {
        endpoint,
        payload,
        invitation,
      });

      await api.post(endpoint, payload);

      toastStore.showToast({
        type: 'accept',
        message: invitation.contentType === 'BOOK'
          ? '친구와 만나러 가고 있어요'
          : '함께 그림 그리러 가고 있어요',
      });
    } catch (error) {
      console.error('Accept invitation error details:', {
        error,
        requestData: invitation,
      });
      toastStore.showToast({
        type: 'error',
        message: '지금은 함께할 수 없어요',
      });
    }
  },

  rejectInvitation: async (invitation: FriendInvitation) => {
    const toastStore = useToastStore.getState();

    try {
      const endpoint = getInvitationEndpoint(
        invitation.contentType,
        invitation.contentId,
        invitation,
        'reject',
      );

      const payload = {
        inviterId: invitation.inviterId, // inviteeId -> inviterId로 수정
      };

      await api.post(endpoint, payload);

      toastStore.showToast({
        type: 'reject',
        message: invitation.contentType === 'BOOK'
          ? '다음에 여행하기로 했어요'
          : '다음에 함께 그리기로 했어요',
      });
    } catch (error) {
      console.error('Failed to reject invitation:', error);
      toastStore.showToast({
        type: 'error',
        message: '답장을 보내지 못했어요',
      });
    }
  },

  expireInvitation: async (invitation: FriendInvitation) => {
    const { showToast } = useToastStore.getState();

    try {
      const endpoint = getInvitationEndpoint(
        invitation.contentType,
        invitation.contentId,
        invitation,
        'expire',
      );

      const payload = {
        inviterId: invitation.inviterId,
      };

      await api.post(endpoint, payload);

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

  const handleInvitation = async (
    contentId: number,
    inviterId: number,
    inviteeId: number,
    contentType: ContentType,
    inviterName: string,
    inviteeName: string,
    contentTitle: string,
  ) => {
    try {
      await inviteFriend({
        contentId,
        inviterId,
        inviteeId,
        contentType,
        inviterName,
        inviteeName,
        contentTitle,
      });
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
