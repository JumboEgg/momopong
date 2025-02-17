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
      <div className="flex justify-center items-center h-48 sm:h-64 md:h-80 text-sm sm:text-base md:text-lg text-gray-500">
        로그인이 필요합니다.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 sm:h-64 md:h-80">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-48 sm:h-64 md:h-80 text-sm sm:text-base md:text-lg text-red-500">
        {error}
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="flex justify-center items-center h-48 sm:h-64 md:h-80 text-sm sm:text-base md:text-lg text-gray-500">
        아직 친구가 없습니다.
      </div>
    );
  }

  return (
    <div className="bg-witch-haze-50 rounded-lg shadow-sm sm:shadow md:shadow-md">
      {/* 친구 수를 보여주는 헤더 - 고정 */}
      <div className="sticky top-0 p-2 sm:p-3 md:p-4 bg-witch-haze-50 rounded-t-lg">
        <div className="flex justify-end items-center">
          <span className="text-sm sm:text-base md:text-lg text-gray-500">
            {friends.length}
            <span className="ml-1">명</span>
          </span>
        </div>
      </div>

      {/* 친구 목록 컨테이너 */}
      <div className="px-2 sm:px-3 md:px-4 space-y-2 sm:space-y-3 md:space-y-4">
        {friends.map((friend, index) => (
          <div
            key={friend.childId}
            className="transition-all duration-200 hover:transform hover:scale-[1.01]"
          >
            <FriendListItem
              friend={friend}
              isLast={index === friends.length - 1}
            />
          </div>
        ))}
      </div>

      {/* 하단 여백 */}
      <div className="h-2 sm:h-3 md:h-4" />
    </div>
  );
}

export default FriendList;
