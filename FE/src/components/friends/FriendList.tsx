import { useEffect } from 'react';
import { useFriendListStore } from '@/stores/friendListStore';
import FriendListItem from './FriendListItem';

function FriendList(): JSX.Element {
  const {
    friends, loading, error, fetchFriends,
  } = useFriendListStore();

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

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

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">친구 목록</h2>
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
