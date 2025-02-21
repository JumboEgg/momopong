import { useEffect, lazy, Suspense } from 'react';
// import ReadingMode from '@/components/stories/StoryMode/ReadingMode';
// import TogetherMode from '@/components/stories/StoryMode/TogetherMode';
import StorySelection from '@/components/stories/StoryMode/StorySelection';
import ModeSelection from '@/components/stories/ModeSelection/ModeSelection';
import InvitationWaitPage from '@/components/common/multiplayPages/InvitationWaitPage';
import NetworkErrorPage from '@/components/common/multiplayPages/NetworkerrorPage';
import FriendSelection from '@/pages/FriendSelection';
import { useFriends } from '@/stores/friendStore';
import { useStory } from '@/stores/storyStore';
import useSocketStore from '@/components/drawing/hooks/useSocketStore';
import { useBookList } from '@/stores/book/bookListStore';

const ReadingMode = lazy(() => import('@/components/stories/StoryMode/ReadingMode'));
const TogetherMode = lazy(() => import('@/components/stories/StoryMode/TogetherMode'));

function Story() {
  const {
    mode, setMode,
    bookId, setBookId,
    setCurrentIndex,
    setBookRecordId,
  } = useStory();

  const {
    setBookList,
  } = useBookList();

  useEffect(() => {
    setMode(null);
    setBookId(null);
    setCurrentIndex(0);
    setBookList();
    setBookRecordId(null);
  }, []);

  const {
    friend, setFriend, isConnected, setIsConnected,
  } = useFriends();

  const {
    socket, setConnect,
  } = useSocketStore();

  useEffect(() => {
    setConnect(true);
    setIsConnected(false);
    setFriend(null);
  }, [mode]);

  const content = () => {
    if (!bookId) {
      return <StorySelection />;
    }

    if (!mode) {
      return <ModeSelection />;
    }

    if (mode === 'reading') {
      return (
        <Suspense fallback={(
          <div className="w-screen h-screen">
            <div className="fixed bottom-0 w-full h-[30%] min-h-20 bg-gradient-to-t from-black to-transparent" />
            <img
              src="/images/loadingImages/background.webp"
              alt="loading"
              className="w-full h-full object-cover object-center"
            />
            <div className="fixed bottom-10 right-10 text-white text-2xl md:text-3xl font-[BMJUA]">
              <span>동화를 불러오고 있어요</span>
            </div>
          </div>
        )}
        >
          <ReadingMode />
        </Suspense>
      );
    }

    if (!friend) {
      return <FriendSelection />;
    }

    if (!socket) {
      return <NetworkErrorPage />;
    }

    if (!isConnected) {
      return <InvitationWaitPage />;
    }

    if (!isConnected) {
      return <InvitationWaitPage />;
    }

    return (
      <Suspense fallback={(
        <div className="w-screen h-screen">
          <div className="fixed bottom-0 w-full h-[30%] min-h-20 bg-gradient-to-t from-black to-transparent" />
          <img
            src="/images/loadingImages/background.webp"
            alt="loading"
            className="w-full h-full object-cover object-center"
          />
          <div className="fixed bottom-10 right-10 text-white text-2xl md:text-3xl font-[BMJUA]">
            <span>친구를 만나러 가고 있어요</span>
          </div>
        </div>
      )}
      >
        <TogetherMode />
      </Suspense>
    );
  };

  return (
    <div className="w-screen h-screen">
      {content()}
    </div>
  );
}

export default Story;
