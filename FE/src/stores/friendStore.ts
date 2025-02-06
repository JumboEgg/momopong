import { create } from 'zustand';

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
}

interface FriendStore {
  friend: Friend | null;
  setFriend: (f: Friend) => void;
  isConnected: boolean;
  setIsConnected: (state: boolean) => void;
  friendList: Friend[];
}

const useFriendStore = create<FriendStore>((set, get) => ({
  friend: null,
  setFriend: (f) => {
    set({ friend: f });
    console.log(get().friend);
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
}));

export const useFriends = (): FriendStore => useFriendStore();
