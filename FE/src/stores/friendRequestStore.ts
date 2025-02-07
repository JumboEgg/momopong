// 친구 요청, 수락, 거절 로직
import { create } from 'zustand';
import axios from 'axios';
import { FriendRequest } from '@/types/friend';

interface FriendRequestState {
  requests: FriendRequest[];
  isLoading: boolean;
  error: string | null;
  fetchRequests: (childId: number) => Promise<void>;
  sendRequest: (childId: number, code: string) => Promise<void>;
  acceptRequest: (childId: number, friendId: number) => Promise<void>;
  rejectRequest: (childId: number, friendId: number) => Promise<void>;
}

export const useFriendRequestStore = create<FriendRequestState>((set) => ({
  requests: [],
  isLoading: false,
  error: null,

  fetchRequests: async (childId: number) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`/children/${childId}/friend-requests`);
      set({ requests: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch friend requests', isLoading: false });
    }
  },

  sendRequest: async (childId: number, code: string) => {
    try {
      set({ isLoading: true, error: null });
      await axios.post(`/children/${childId}/friend-requests`, { code });
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to send friend request', isLoading: false });
    }
  },

  acceptRequest: async (childId: number, friendId: number) => {
    try {
      set({ isLoading: true, error: null });
      await axios.put(`/children/${childId}/friend-requests/${friendId}`);
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
      await axios.delete(`/children/${childId}/friend-requests/${friendId}`);
      set((state) => ({
        requests: state.requests.filter((req) => req.friendId !== friendId),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to reject friend request', isLoading: false });
    }
  },
}));
