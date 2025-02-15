// components/FriendList.tsx
import { useEffect } from 'react';
import { useFriendListStore } from '@/stores/friendListStore';
import useSubAccountStore from '@/stores/subAccountStore';
import FriendListItem from './FriendListItem';

function FriendList(): JSX.Element {
  const {
    friends, loading, error, startStatusPolling, stopStatusPolling, fetchFriends,
  } = useFriendListStore();

  const { selectedAccount } = useSubAccountStore();

  useEffect(() => {
    if (selectedAccount?.childId) {
      fetchFriends();
      startStatusPolling();

      return () => {
        stopStatusPolling();
      };
    }
    return undefined; // 명시적으로 undefined 반환
  }, [selectedAccount?.childId, fetchFriends]);

  if (!selectedAccount) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        로그인이 필요합니다.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        아직 친구가 없습니다.
      </div>
    );
  }

  return (
    <div className="bg-witch-haze-50 rounded-lg p-4">
      <div className="flex justify-between mb-4">
        <span className="text-gray-500">
          {friends.length}
          명
        </span>
      </div>
      <div className="divide-y divide-gray-200">
        {friends.map((friend) => (
          <FriendListItem
            key={friend.childId}
            friend={friend}
          />
        ))}
      </div>
    </div>
  );
}

export default FriendList;
