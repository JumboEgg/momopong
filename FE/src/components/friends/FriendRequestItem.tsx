interface FriendRequestItemProps {
  message: string;
  profileImage?: string;
}

function FriendRequestItem({
  message,
  profileImage = '', // 기본 여우 이미지 경로
}: FriendRequestItemProps): JSX.Element {
  return (
    <div className="bg-white rounded-lg p-4 mb-3 flex items-center space-x-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 flex-shrink-0">
        <img
          src={profileImage}
          alt="Profile"
          className="w-full h-full rounded-full object-cover"
        />
      </div>
      <span className="flex-grow text-gray-800 text-sm">
        {message}
      </span>
    </div>
  );
}

export default FriendRequestItem;
