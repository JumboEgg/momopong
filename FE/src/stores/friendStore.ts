import { create } from 'zustand';
import axios from 'axios';

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
}

interface FriendStore {
  friend: Friend | null;
  setFriend: (f: Friend | null) => void;
  isConnected: boolean;
  setIsConnected: (state: boolean) => void;
  friendList: Friend[];
  fetchFriends: (bookId: string, childId: string) => Promise<void>;
}

const useFriendStore = create<FriendStore>((set) => ({
  friend: null,
  setFriend: (f) => {
    set({ friend: f });
  },

  isConnected: false,
  setIsConnected: (state) => set({ isConnected: state }),

  friendList: [
    {
      id: '1', name: '미나', avatar: '/images/profileicon.png', status: 'online',
    },
    {
      id: '2', name: '준호', avatar: '/images/profileicon.png', status: 'online',
    },
    {
      id: '3', name: '소희', avatar: '/images/profileicon.png', status: 'offline',
    },
    {
      id: '4', name: '태민', avatar: '/images/profileicon.png', status: 'online',
    },
  ],

  // 동화 함께읽기모드 친구목록
  fetchFriends: async (bookId, childId) => {
    try {
      const response = await axios.get(`/api/book/${bookId}/friend/${childId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('childAccessToken')}`,
        },
      });
      set({ friendList: response.data });
    } catch (error) {
      console.error('Failed to fetch friends:', error);
    }
  },
}));

export const useFriends = (): FriendStore => useFriendStore();
