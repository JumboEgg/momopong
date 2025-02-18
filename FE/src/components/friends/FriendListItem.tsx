import type { Friend } from '@/types/friend';

interface FriendListItemProps {
  friend: Friend;
  isLast?: boolean;
}

const DEFAULT_PROFILE = '/images/default-profile.jpg'; // public 폴더 내 경로

const getStatusColor = (status: Friend['status']) => {
  switch (status) {
    case 'ONLINE':
      return 'bg-green-500';
    case 'MATCHING':
      return 'bg-blue-ribbon-500';
    case 'READING':
      return 'bg-red-400';
    case 'DRAWING':
      return 'bg-tainoi-400';
    default:
      return 'bg-gray-500';
  }
};

const getStatusText = (status: Friend['status']) => {
  switch (status) {
    case 'ONLINE':
      return '접속중';
    case 'MATCHING':
      return '매칭중';
    case 'READING':
      return '여행중';
    case 'DRAWING':
      return '색칠중';
    default:
      return '쉬는중';
  }
};

function FriendListItem({ friend, isLast }: FriendListItemProps): JSX.Element {
  const statusColor = getStatusColor(friend.status);
  const statusText = getStatusText(friend.status);

  const profileImage = friend.profile || DEFAULT_PROFILE;

  return (
    <div className="flex items-center justify-between py-2">
      <div className={`flex items-center justify-between w-[95%] mx-auto ${!isLast && 'border-b border-gray-200'} pb-6`}>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={profileImage}
              alt={`${friend.name} profile`}
              className="w-12 h-12 rounded-full"
              onError={(e) => {
                console.error('Image load error:', e);
                e.currentTarget.src = DEFAULT_PROFILE;
              }}
            />
          </div>
          <span className="text-lg font-medium font-[BMJUA]">{friend.name}</span>
        </div>
        <div className="flex items-center">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusColor} text-white text-sm`}>
            <div className="w-2 h-2 rounded-full bg-white" />
            <span>{statusText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FriendListItem;
