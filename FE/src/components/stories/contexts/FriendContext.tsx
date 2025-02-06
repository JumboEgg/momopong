// contexts/FriendContext.tsx
import {
  createContext, useContext, ReactNode, useMemo,
} from 'react';

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
}

interface FriendContextType {
  friends: Friend[];
  getFriendById: (id: string) => Friend | undefined;
}

const FriendContext = createContext<FriendContextType | undefined>(undefined);

export function FriendProvider({ children }: { children: ReactNode }) {
  // 임시 친구 데이터 (실제로는 API에서 가져와야 함)
  const friends: Friend[] = [
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
  ];

  // useMemo로 context value를 메모이제이션
  const value = useMemo(() => ({
    friends,
    getFriendById: (id: string) => friends.find((friend) => friend.id === id),
  }), [friends]);

  return (
    <FriendContext.Provider value={value}>
      {children}
    </FriendContext.Provider>
  );
}

export function useFriends() {
  const context = useContext(FriendContext);
  if (context === undefined) {
    throw new Error('useFriends must be used within a FriendProvider');
  }
  return context;
}
