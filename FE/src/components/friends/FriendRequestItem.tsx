import { FriendRequest } from '@/types/friend';

interface FriendRequestItemProps {
  request: FriendRequest;
  onAccept: (friendId: number) => Promise<void>;
  onReject: (friendId: number) => Promise<void>;
}

function FriendRequestItem({
  request,
  onAccept,
  onReject,
}: FriendRequestItemProps): JSX.Element {
  const { friendId, fromProfile, fromName } = request;
  return (
    <div className="bg-white rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 flex-shrink-0">
          <img
            src={fromProfile}
            alt={`${fromName}(이)의 프로필`}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <span className="text-gray-800 text-sm">
          `
          {fromName}
          `
          이(가) 친구 요청을 보냈어요
        </span>
      </div>
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => onAccept(friendId)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          수락
        </button>
        <button
          type="button"
          onClick={() => onReject(friendId)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          거절
        </button>
      </div>
    </div>
  );
}
export default FriendRequestItem;
