import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenService } from '@/services/tokenService';
import { getOnlineFriends, inviteFriendToPlay } from '@/api/storyApi';
import { HandleAllowNotification, onMessageListener } from '@/services/firebaseService';
import type { Friend } from '@/api/storyApi';
import { useStory } from '@/stores/storyStore';

function FriendSelection(): JSX.Element {
  const navigate = useNavigate();
  const { bookId } = useStory(); // useParams 대신 useStory 사용
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // FCM 메시지 리스너 설정
  useEffect(() => {
    const unsubscribe = onMessageListener().then((payload: any) => {
      console.log('메시지 수신:', payload);
      // 필요한 경우 여기서 알림 상태 처리
    }).catch((err) => console.log('failed: ', err));

    return () => {
      // 클린업
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    const fetchOnlineFriends = async () => {
      console.log('현재 bookId:', bookId);

      if (!bookId) {
        console.log('bookId가 없음');
        setError('책 정보가 없습니다.');
        return;
      }

      const currentChildId = tokenService.getCurrentChildId();
      console.log('현재 currentChildId:', currentChildId);

      if (!currentChildId) {
        console.log('currentChildId가 없음');
        setError('로그인이 필요합니다.');
        return;
      }

      try {
        setLoading(true);
        console.log('친구 목록 API 호출 시작', {
          bookId,
          childId: String(currentChildId),
        });

        const response = await getOnlineFriends(
          bookId,
          String(currentChildId),
        );

        console.log('받아온 친구 목록:', response);

        // 응답 데이터 유효성 검사
        if (!Array.isArray(response)) {
          console.error('Invalid response format:', response);
          throw new Error('서버 응답 형식이 올바르지 않습니다.');
        }

        setFriends(response);
      } catch (err) {
        console.error('친구 목록 조회 실패:', err);
        setError('친구 목록을 불러오는데 실패했습니다.');
        setFriends([]); // 에러 시 빈 배열로 초기화
      } finally {
        setLoading(false);
      }
    };

    fetchOnlineFriends();
  }, [bookId]);

  const handleInviteFriend = async (inviteeId: string) => {
    if (!bookId) {
      setError('책 정보가 없습니다.');
      return;
    }

    const currentChildId = tokenService.getCurrentChildId();
    if (!currentChildId) {
      setError('로그인이 필요합니다.');
      return;
    }

    try {
      setLoading(true);
      console.log('친구 초대 API 호출', {
        bookId,
        inviterId: String(currentChildId),
        inviteeId,
      });

      // FCM 권한 요청 및 토큰 설정
      await HandleAllowNotification();

      // 초대 API 호출
      await inviteFriendToPlay(
        String(bookId),
        String(currentChildId),
        inviteeId,
      );

      console.log('초대 성공');
      // navigate(`/invitation-waiting/${bookId}`); // 라우팅 제거
    } catch (err) {
      console.error('친구 초대 실패:', err);
      setError('친구 초대에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  console.log('렌더링 상태:', {
    bookId,
    friendsCount: friends.length,
    loading,
    error,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800"
          >
            ← 뒤로
          </button>
          <h2 className="text-2xl font-bold text-center flex-1">함께 읽을 친구 선택</h2>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="mb-4 text-sm text-gray-600">
          디버그 정보:
          <br />
          bookId:
          {' '}
          {bookId}
          <br />
          친구 수:
          {' '}
          {friends.length}
        </div>

        {friends.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            현재 온라인인 친구가 없습니다
          </div>
        ) : (
          <div className="space-y-4">
            {friends.map((friend) => (
              <button
                key={friend.childId}
                type="button"
                onClick={() => handleInviteFriend(friend.childId)}
                className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                disabled={loading}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={friend.profile}
                    alt={friend.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <p className="font-medium text-gray-900">{friend.name}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-sm text-green-500">온라인</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FriendSelection;
