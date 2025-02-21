// 친구 요청, 수락, 거절 로직
import { create } from 'zustand';
import api from '@/api/axios';
import { FriendRequest } from '@/types/friend';
import { AxiosError } from 'axios';
import { tokenService } from '@/services/tokenService';
import debounce from 'lodash/debounce';

interface FriendRequestState {
  requests: FriendRequest[];
  lastFetchedChildId: number | null;
  isLoading: boolean;
  error: string | null;
  fetchRequests: (childId: number) => Promise<void>;
  sendRequest: (childId: number, code: string) => Promise<void>;
  acceptRequest: (childId: number, friendId: number) => Promise<void>;
  rejectRequest: (childId: number, friendId: number) => Promise<void>;
}

const fetchRequestsWithDebounce = debounce(async (
  childId: number,
  store: Pick<FriendRequestState, 'lastFetchedChildId' | 'requests'>,
  setStore: (state: Partial<FriendRequestState>) => void,
 ) => {
  if (store.lastFetchedChildId === childId && store.requests.length) {
    return;
  }

  setStore({ lastFetchedChildId: childId });
  // console.log('Fetching requests for childId:', childId);

  try {
    setStore({ isLoading: true, error: null });

    const activeToken = tokenService.getActiveToken();
    if (!activeToken) {
      throw new Error('로그인이 필요합니다.');
    }

    const response = await api.get(`/children/${childId}/friend-requests`);
    setStore({ requests: response.data, isLoading: false });
  } catch (err) {
    if (err instanceof AxiosError) {
      const errorMessage = err.response?.status === 403
        ? '권한이 없습니다. 자녀 계정으로 로그인되어 있는지 확인해주세요.'
        : '친구 요청 목록을 불러오는데 실패했습니다.';
      setStore({ error: errorMessage, isLoading: false });
    } else {
      setStore({ error: '친구 요청 목록을 불러오는대 실패했습니다.', isLoading: false });
    }
  }
 }, 300);

 const useFriendRequestStore = create<FriendRequestState>((set, get) => ({
  lastFetchedChildId: null,
  requests: [],
  isLoading: false,
  error: null,

  fetchRequests: async (childId: number) => {
    await fetchRequestsWithDebounce(childId, get(), set);
  },

  sendRequest: async (childId: number, code: string) => {
    try {
      set({ isLoading: true, error: null });

      // 현재 활성화된 토큰 확인
      const activeToken = tokenService.getActiveToken();
      if (!activeToken) {
        throw new Error('로그인이 필요합니다.');
      }

      // console.log('Active Token:', activeToken);
      // console.log('Request payload:', { childId, code });
      await api.post(`/children/${childId}/friend-requests`, { code });

      set({ isLoading: false });
    } catch (err) {
      const error = err as AxiosError; // AxiosError로 타입 단언
      const errorMessage = error.response?.status === 404
        ? '잘못된 친구 코드입니다.'
        : '친구 요청 전송에 실패했습니다.';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  acceptRequest: async (childId: number, friendId: number) => {
    try {
      set({ isLoading: true, error: null });
      await api.post(`/children/${childId}/friend-requests/${friendId}`);
      set((state) => ({
        requests: state.requests.filter((req) => req.friendId !== friendId),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to accept friend request', isLoading: false });
    }
  },

  rejectRequest: async (childId: number, friendId: number) => {
    try {
      set({ isLoading: true, error: null });
      await api.delete(`/children/${childId}/friend-requests/${friendId}`);
      set((state) => ({
        requests: state.requests.filter((req) => req.friendId !== friendId),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to reject friend request', isLoading: false });
    }
  },
}));

export default useFriendRequestStore;
