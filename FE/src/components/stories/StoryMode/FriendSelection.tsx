import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDrawing } from '@/stores/drawingStore';
import { useFriends } from '@/stores/friendStore';

function FriendSelection(): JSX.Element {
  const { bookId, childId } = useParams();
  const { setMode } = useDrawing();
  const { friendList, setFriend, fetchFriends } = useFriends();

  useEffect(() => {
    if (bookId && childId) {
      fetchFriends(bookId, childId);
    }
  }, [bookId, childId, fetchFriends]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center mb-6">
          <button
            type="button"
            onClick={() => setMode(null)}
            className="text-gray-600 hover:text-gray-800"
          >
            ← 뒤로
          </button>
          <h2 className="text-2xl font-bold text-center flex-1">함께 읽을 친구 선택</h2>
        </div>

        <div className="space-y-4">
          {friendList.map((friend) => (
            <button
              key={friend.id}
              type="button"
              onClick={() => setFriend(friend)}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              disabled={friend.status === 'offline'}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={friend.avatar}
                  alt={`${friend.name}`}
                  className="w-10 h-10 rounded-full"
                />
                <p className="font-medium text-gray-900">{friend.name}</p>
              </div>
              <div className="flex items-center space-x-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: friend.status === 'online' ? 'var(--color-green-500)' : 'var(--color-gray-400)' }}
                />
                <p className={`text-sm ${
                  friend.status === 'online' ? 'text-green-500' : 'text-gray-400'
                }`}
                >
                  {friend.status === 'online' ? '온라인' : '오프라인'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FriendSelection;
