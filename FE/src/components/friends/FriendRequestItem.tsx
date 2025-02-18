import { FriendRequest } from '@/types/friend';

interface FriendRequestItemProps {
  request: FriendRequest;
  onAccept: (friendId: number) => Promise<void>;
  onReject: (friendId: number) => Promise<void>;
}

const DEFAULT_PROFILE = '/images/default-profile.jpg';

function FriendRequestItem({
  request,
  onAccept,
  onReject,
}: FriendRequestItemProps): JSX.Element {
  const { friendId, fromProfile, fromName } = request;
  const profileImage = fromProfile || DEFAULT_PROFILE;

  return (
    <div className="
      bg-broom-100
      rounded-lg
      p-4
      mb-2
      flex
      items-center
      justify-between
      shadow-sm
    "
    >
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-full bg-witch-haze-100 flex-shrink-0 overflow-hidden">
          <img
            src={profileImage}
            alt={`${fromName}의 프로필`}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Image load error:', e);
              e.currentTarget.src = DEFAULT_PROFILE;
            }}
          />
        </div>
        <span className="text-gray-800 font-[BMJUA]">
          {fromName}
          {' '}
          이(가) 친구 요청을 보냈어요
        </span>
      </div>

      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => onAccept(friendId)}
          className="
            px-4
            py-1.5
            bg-blue-ribbon-300
            text-white
            rounded-full
            font-[BMJUA]
            hover:bg-blue-600
            transition-colors
          "
        >
          수락
        </button>
        <button
          type="button"
          onClick={() => onReject(friendId)}
          className="
            px-4
            py-1.5
            bg-gray-200
            text-gray-700
            rounded-full
            font-[BMJUA]
            hover:bg-gray-300
            transition-colors
          "
        >
          거절
        </button>
      </div>
    </div>
  );
}

export default FriendRequestItem;
