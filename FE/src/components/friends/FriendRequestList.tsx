// src/components/friends/FriendRequestList.tsx
import { useFriendRequestStore } from '@/stores/friendRequestStore';
import FriendRequestItem from './FriendRequestItem';

function FriendRequestList(): JSX.Element {
  const { requests } = useFriendRequestStore();

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-500">받은 친구 요청이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4">
      {requests.map((request) => (
        <FriendRequestItem
          key={request.friendId}
          message="친구 요청을 보냈어요"
          // profileImage는 API에서 제공되면 추가
        />
      ))}
    </div>
  );
}

export default FriendRequestList;
