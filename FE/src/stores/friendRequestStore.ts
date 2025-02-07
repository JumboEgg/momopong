// 친구 요청, 수락, 거절 로직
import { create } from 'zustand';
import api from '@/api/axios';
import { FriendRequest } from '@/types/friend';
import { AxiosError } from 'axios';

interface FriendRequestState {
  requests: FriendRequest[];
  isLoading: boolean;
  error: string | null;
  fetchRequests: (childId: number) => Promise<void>;
  sendRequest: (childId: number, code: string) => Promise<void>;
  acceptRequest: (childId: number, friendId: number) => Promise<void>;
  rejectRequest: (childId: number, friendId: number) => Promise<void>;
}

const useFriendRequestStore = create<FriendRequestState>((set) => ({
  requests: [],
  isLoading: false,
  error: null,

  fetchRequests: async (childId: number) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get(`/children/${childId}/friend-requests`);
      set({ requests: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch friend requests', isLoading: false });
    }
  },

  sendRequest: async (childId: number, code: string) => {
    try {
      set({ isLoading: true, error: null });
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
      await api.put(`/children/${childId}/friend-requests/${friendId}`);
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
