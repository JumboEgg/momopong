import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { tokenService } from '@/services/tokenService';
import { useFriendListStore } from '@/stores/friendListStore';
import useSubAccountStore from '@/stores/subAccountStore';
import { ContentType } from '@/types/invitation';
// import { useFriends } from '@/stores/friendStore';
// import useSocketStore from '@/components/drawing/hooks/useSocketStore';
import { Friend } from '@/types/friend';
import { useDrawing } from '@/stores/drawing/drawingStore';
import { useBookContent } from '@/stores/book/bookContentStore';
import { useStory } from '@/stores/storyStore';
import FriendListItem from '@/components/friends/FriendListItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { IconCircleButton } from '@/components/common/buttons/CircleButton';
import InvitationWaitPage from '@/components/common/multiplayPages/InvitationWaitPage';

function FriendSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { template, setTemplate } = useDrawing();
  const { bookContent } = useBookContent();
  const { setBookId, bookId } = useStory();
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);

  const {
    friends,
    loading,
    // error,
    inviteFriend,
    fetchOnlineFriends,
  } = useFriendListStore();

  const handleBack = () => {
    const isStoryMode = location.pathname.startsWith('/story');

    if (isStoryMode) {
      // Story 모드일 때는 bookId를 초기화하고 뒤로가기
      setBookId(null); // useStory에서 가져온 setBookId 필요
      window.history.back();
    } else {
      // Drawing 모드일 때는 template을 초기화하고 drawing 페이지로
      setTemplate(null); // useDrawing에서 가져온 setTemplate 필요
      navigate('/drawing');
    }
};

  // 친구 목록 가져오기
  useEffect(() => {
    const fetchFriends = async () => {
      const targetContentId = template?.sketchId || bookId;
      if (!targetContentId) return;

      try {
        const targetContentType: ContentType = template ? 'SKETCH' : 'BOOK'; // template 유무로 구분

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

    // 대기 상태 설정
    setIsWaitingResponse(true);

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
        contentId: targetContentId,
        inviterId: currentChildId,
        inviteeId,
        contentType: targetContentType,
        inviterName: currentUser.name,
        inviteeName: friend.name,
        contentTitle,
      });

      const isStoryMode = location.pathname.startsWith('/story');
      const path = isStoryMode ? '/story' : '/drawing';

      // navigate 실행
      navigate(path, {
        state: {
          waitingForResponse: true,
          ...(isStoryMode
            ? {
                contentId: targetContentId,
                contentType: targetContentType,
                contentTitle,
              }
            : {
                templateId: targetContentId,
                templateName: contentTitle,
                mode: 'together',
              }
          ),
        },
        replace: true,
      });
    } catch (err) {
      console.error('친구 초대 실패:', err);
      setIsWaitingResponse(false); // 에러 발생시 대기 상태 해제
    }
  };

  if (loading || isWaitingResponse) {
    return (
      <InvitationWaitPage
        message="친구에게 초대장을 보내고 있어요"
        showTimer
        duration={10}
        onComplete={() => {
          setIsWaitingResponse(false);
          const isStoryMode = location.pathname.startsWith('/story');
          navigate(isStoryMode ? '/story' : '/drawing', {
            state: { waitingForResponse: false },
            replace: true,
          });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black/30 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="relative w-[95%] sm:w-[85%] md:w-[70%] lg:w-[60%] xl:w-1/2
                    h-auto sm:h-[550px] md:h-[600px] min-h-[400px] max-h-[85vh]
                    bg-broom-200 border-6 sm:border-8 md:border-10 border-tainoi-400
                    rounded-[3vw] sm:rounded-[2.5vw] md:rounded-[2vw] flex flex-col
                    px-3 sm:px-4 md:px-6 lg:px-8 pt-8 sm:pt-9 md:pt-10 pb-3 sm:pb-4 md:pb-6
                    overflow-y-auto"
      >
        <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4">
          <IconCircleButton
            size="sm"
            variant="action"
            onClick={handleBack}
            icon={<FontAwesomeIcon icon={faArrowLeft} size="lg" />}
          />
        </div>

        <h2 className="text-3xl font-[BMJUA] text-gray-800 text-center mb-6">
          함께
          {' '}
          {location.pathname.startsWith('/story') ? '읽을' : '그릴'}
          {' '}
          친구 선택
        </h2>

        <div className="mb-4 font-[BMJUA] text-sm text-gray-700 text-right">
          대기중인 친구 수:
          {' '}
          {friends.length}
        </div>

        <div className="flex-1 w-full overflow-y-auto customScrollbar yellow px-2 sm:px-3 md:px-4">
          <div className="bg-witch-haze-100 rounded-lg shadow-sm p-4">
            {friends.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                지금은 함께할 수 있는 친구가 없어요
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {friends.map((friend) => (
                  <button
                    key={friend.childId}
                    type="button"
                    onClick={() => handleInviteFriend(friend.childId, friend)}
                    className="w-full transition-colors py-2"
                    disabled={loading}
                  >
                    <FriendListItem friend={friend} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FriendSelection;
