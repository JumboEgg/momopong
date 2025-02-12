import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { tokenService } from '@/services/tokenService';
import { saveFCMToken } from '@/api/storyApi';
import { HandleAllowNotification, messaging } from '@/services/firebaseService';

import { getToken } from 'firebase/messaging';
// import { useStory } from '@/stores/storyStore';
import { useFriendListStore } from '@/stores/friendListStore';
import useSubAccountStore from '@/stores/subAccountStore';
import { Friend } from '@/types/friend';

function FriendSelection() { // props 제거
  const navigate = useNavigate();
  const location = useLocation();
  const { contentId, contentType } = location.state || {};
  // const { setContentTitle } = useStory(); // StoryStore에서 contentTitle을 설정

  // console.log('Location state:', location.state); // location.state 전체 확인
  // console.log('ContentId and type:', { contentId, contentType }); // contentId와 type 확

  const {
    friends,
    loading,
    error,
    inviteFriend,
    fetchOnlineFriends,
  } = useFriendListStore();
  // FCM 토큰 등록
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
      if (!contentId) return;

      try {
        await fetchOnlineFriends(contentId, contentType);
      } catch (err) {
        console.error('친구 목록 가져오기 실패:', err);
      }
    };

    fetchFriends();
  }, [contentId, contentType, fetchOnlineFriends]);

  const handleInviteFriend = async (inviteeId: number, friend: Friend) => {
    const currentChildId = tokenService.getCurrentChildId();
    const currentUser = useSubAccountStore.getState().selectedAccount;

    if (!currentChildId || !currentUser) {
      console.error('사용자 정보가 없습니다.');
      return;
    }

    try {
      await inviteFriend({
        contentId,
        inviterId: currentChildId,
        inviteeId,
        contentType,
        inviterName: currentUser.name,
        inviteeName: friend.name,
        contentTitle: location.state.contentTitle, // location.state에서 온 실제 contentTitle 사용
      });

      navigate(contentType === 'BOOK' ? '/waiting-room' : '/sketch-waiting-room');
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
          <h2 className="text-2xl font-bold text-center flex-1">함께 읽을 친구 선택</h2>
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
