// stores/friendListStore.ts
import { create } from 'zustand';
import type { Friend } from '@/types/friend';
import type { ContentType, FriendInvitation } from '@/types/invitation';
import api from '@/api/axios';
import { tokenService } from '@/services/tokenService';
import useToastStore from './toastStore';
import { useRoleStore, type StoryRole, STORY_ROLES } from './roleStore';

// 에러 상태코드별 메시지 처리
interface AxiosError {
  response?: {
    status: number;
  };
}

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
  currentPollingInterval: NodeJS.Timeout | null;
  friendStatusPolling: NodeJS.Timeout | null;

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
  startContentPolling: (contentId: number, contentType: ContentType) => void;
  stopContentPolling: () => void;
  startStatusPolling: () => void;
  stopStatusPolling: () => void;
}

export const useFriendListStore = create<FriendList>()((set, get) => ({
  // 초기 상태
  friends: [],
  selectedFriend: null,
  loading: false,
  error: null,
  isConnected: false,
  currentPollingInterval: null,
  friendStatusPolling: null,

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
    const currentChildId = tokenService.getCurrentChildId();
    if (!currentChildId) return;

    try {
      const endpoint = contentType === 'SKETCH'
        ? `/sketch/${contentId}/friend/${currentChildId}`
        : `/book/${contentId}/friend/${currentChildId}`;

      const response = await api.get(endpoint);
      const sortedFriends = sortByOnlineStatus(response.data);

      set({
        friends: sortedFriends,
        loading: false,
        error: null,
      });
    } catch (error) {
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
        roleStore.setRoles(
          inviterRole,
          inviteeRole,
          invitation.contentId,
          invitation.inviterId,
          invitation.inviteeId,
        );
      }

      await api.post(endpoint, payload);

      toastStore.showToast({
        type: 'success',
        message: invitation.contentType === 'BOOK'
          ? '친구에게 여행 초대장을 보냈어요!'
          : '친구에게 함께 그릴지 물어볼게요!',
      });
    } catch (error) {
      // console.error('Failed to invite friend:', error);
      const errorMessage = error instanceof Error ? error.message : '친구 초대에 실패했습니다.';
      set({ error: errorMessage });

      const axiosError = error as AxiosError;
      if (axiosError && axiosError.response && axiosError.response.status) {
        switch (axiosError.response.status) {
          case 400:
            toastStore.showToast({
              type: 'error',
              message: '이미 보내 둔 초대장이 있어요',
            });
            break;
          case 404:
            toastStore.showToast({
              type: 'error',
              message: '친구가 지금은 초대를 받을 수 없어요',
            });
            break;
          case 410:
            toastStore.showToast({
              type: 'error',
              message: '앗, 오래된 초대장은 받을 수 없어요',
            });
            break;
          default:
            toastStore.showToast({
              type: 'error',
              message: '초대장을 보내지 못했어요',
            });
        }
      } else {
        toastStore.showToast({
          type: 'error',
          message: '초대장을 보내지 못했어요',
        });
      }
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
        roleStore.setRoles(
          inviterRole,
          inviteeRole,
          invitation.contentId,
          invitation.inviterId,
          invitation.inviteeId,
        );
      }
      // console.log('Accept invitation request:', {
      //   endpoint,
      //   payload,
      //   invitation,
      // });

      await api.post(endpoint, payload);

      toastStore.showToast({
        type: 'accept',
        message: invitation.contentType === 'BOOK'
          ? '친구와 만나러 가고 있어요'
          : '함께 그림 그리러 가고 있어요',
      });
    } catch (error) {
      // console.error('Accept invitation error details:', {
      //   error,
      //   requestData: invitation,
      // });
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
      // console.error('Failed to reject invitation:', error);
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
      // console.error('Failed to expire invitation:', error);
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
    const { stopStatusPolling, fetchFriends } = get();

    // 기존 폴링 중지
    stopStatusPolling();

    // 새로운 폴링 시작
    const interval = setInterval(() => {
      const currentChildId = tokenService.getCurrentChildId();
      if (currentChildId) {
        fetchFriends();
      }
    }, 30000);

    set({ friendStatusPolling: interval });
  },

  stopStatusPolling: () => {
    const { friendStatusPolling } = get();
    if (friendStatusPolling) {
      clearInterval(friendStatusPolling);
      set({ friendStatusPolling: null });
    }
  },

  // 콘텐츠별 실시간 폴링 (5초)
  startContentPolling: (contentId: number, contentType: ContentType) => {
    const { stopContentPolling, fetchOnlineFriends } = get();

    stopContentPolling();
    fetchOnlineFriends(contentId, contentType);

    const interval = setInterval(() => {
      fetchOnlineFriends(contentId, contentType);
    }, 5000);

    set({ currentPollingInterval: interval });
  },

  stopContentPolling: () => {
    const { currentPollingInterval } = get();
    if (currentPollingInterval) {
      clearInterval(currentPollingInterval);
      set({ currentPollingInterval: null });
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
