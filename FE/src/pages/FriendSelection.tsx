import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { tokenService } from '@/services/tokenService';
import { saveFCMToken } from '@/api/storyApi';
import { HandleAllowNotification, messaging } from '@/services/firebaseService';
import { getToken } from 'firebase/messaging';
import { useFriendListStore } from '@/stores/friendListStore';
import useSubAccountStore from '@/stores/subAccountStore';
import { ContentType } from '@/types/invitation';
// import { useFriends } from '@/stores/friendStore';
// import useSocketStore from '@/components/drawing/hooks/useSocketStore';
import { Friend } from '@/types/friend';
import { useDrawing } from '@/stores/drawing/drawingStore';
import { useBookContent } from '@/stores/book/bookContentStore';
import { useStory } from '@/stores/storyStore';

function FriendSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { template } = useDrawing();
  const { bookContent } = useBookContent();
  const { bookId } = useStory();

  const {
    friends,
    loading,
    error,
    inviteFriend,
    fetchOnlineFriends,
  } = useFriendListStore();

  // FCM 토큰 등록 (기존 코드와 동일)
  useEffect(() => {
    const registerFCMToken = async () => {
      try {
        const currentChildId = tokenService.getCurrentChildId();
        if (!currentChildId) {
          throw new Error('로그인이 필요합니다.');
        }

        await HandleAllowNotification();
        const fcmToken = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });

        if (!fcmToken) {
          throw new Error('FCM 토큰을 가져오지 못했습니다.');
        }

        await saveFCMToken(currentChildId, fcmToken);
      } catch (err) {
        console.error('FCM 토큰 등록 실패:', err);
      }
    };

    registerFCMToken();
  }, []);

  // 친구 목록 가져오기
  useEffect(() => {
    const fetchFriends = async () => {
      const targetContentId = template?.sketchId || bookId;
      if (!targetContentId) return;

      try {
        const targetContentType: ContentType = template ? 'SKETCH' : 'BOOK'; // template 유무로만 구분

        await fetchOnlineFriends(targetContentId, targetContentType);
      } catch (err) {
        console.error('친구 목록 가져오기 실패:', err);
      }
    };

    fetchFriends();
  }, [template, bookId, fetchOnlineFriends]);

  const handleInviteFriend = async (inviteeId: number, friend: Friend) => {
    const currentChildId = tokenService.getCurrentChildId();
    const currentUser = useSubAccountStore.getState().selectedAccount;

    if (!currentChildId || !currentUser) {
      console.error('사용자 정보가 없습니다.');
      return;
    }

    try {
      const targetContentId = template?.sketchId || bookId;

      // null 체크 추가
      if (!targetContentId) {
        throw new Error('콘텐츠 ID가 없습니다.');
      }

      const targetContentType: ContentType = template ? 'SKETCH' : 'BOOK';

      let contentTitle;
      if (template) {
        contentTitle = `함께 그리기: ${template.sketchTitle}`;
      } else {
        contentTitle = bookContent?.bookTitle;
      }

      if (!contentTitle) {
        throw new Error('콘텐츠 제목이 없습니다.');
      }

      await inviteFriend({
        contentId: targetContentId, // 이제 targetContentId는 확실히 number 타입
        inviterId: currentChildId,
        inviteeId,
        contentType: targetContentType,
        inviterName: currentUser.name,
        inviteeName: friend.name,
        contentTitle,
      });

      // Story 모드인지 확인
      const isStoryMode = location.pathname.startsWith('/story');

      if (isStoryMode) {
        // Story 모드일 때는 현재 경로를 그대로 유지
        const currentState = {
          ...location.state,
          waitingForResponse: true,
          contentId: targetContentId,
          contentType: targetContentType,
          contentTitle,
        };

        navigate(location.pathname, {
          state: currentState,
          replace: true,
        });
      } else {
        // Drawing 모드일 때만 /drawing으로 이동
        navigate('/drawing', {
          state: {
            waitingForResponse: true,
            templateId: targetContentId,
            templateName: contentTitle,
          },
          replace: true,
        });
      }
    } catch (err) {
      console.error('친구 초대 실패:', err);
    }
};

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
          <h2 className="text-2xl font-bold text-center flex-1">
            함께
            {' '}
            {template ? '그릴' : '읽을'}
            {' '}
            친구 선택
          </h2>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="mb-4 text-sm text-gray-600">
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
                onClick={() => handleInviteFriend(friend.childId, friend)}
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
