interface FriendRequestItemProps {
  message: string;
  profileImage?: string;
  onAccept?: () => void;
  onReject?: () => void;
}

function FriendRequestItem({
  message,
  profileImage = '',
  onAccept,
  onReject,
}: FriendRequestItemProps): JSX.Element {
  return (
    <div className="bg-white rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 flex-shrink-0">
          <img
            src={profileImage}
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <span className="text-gray-800 text-sm">
          {message}
        </span>
      </div>
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={onAccept}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          수락
        </button>
        <button
          type="button"
          onClick={onReject}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          거절
        </button>
      </div>
    </div>
  );
}
export default FriendRequestItem;
