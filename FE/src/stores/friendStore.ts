import { create } from 'zustand';
import { Friend as NewFriend } from '@/types/friend';

interface FriendStore {
  friend: NewFriend | null;
  setFriend: (f: NewFriend | null) => void;
  isConnected: boolean;
  setIsConnected: (state: boolean) => void;
}

const useFriendStore = create<FriendStore>((set) => ({
  friend: null,
  setFriend: (f) => {
    set({ friend: f });
  },
  isConnected: false,
  setIsConnected: (state) => set({ isConnected: state }),
}));

export const useFriends = (): FriendStore => useFriendStore();
