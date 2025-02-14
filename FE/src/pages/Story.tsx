import { useEffect } from 'react';
import ReadingMode from '@/components/stories/StoryMode/ReadingMode';
import TogetherMode from '@/components/stories/StoryMode/TogetherMode';
import StorySelection from '@/components/stories/StoryMode/StorySelection';
import ModeSelection from '@/components/stories/ModeSelection/ModeSelection';
import InvitationWaitPage from '@/components/common/multiplayPages/InvitationWaitPage';
import NetworkErrorPage from '@/components/common/multiplayPages/NetworkerrorPage';
import FriendSelection from '@/pages/FriendSelection';
import { useFriends } from '@/stores/friendStore';
import { useStory } from '@/stores/storyStore';
import useSocketStore from '@/components/drawing/hooks/useSocketStore';
import { useBookList } from '@/stores/book/bookListStore';

function Story() {
  const {
    mode, setMode, bookId, setBookId, setCurrentIndex,
  } = useStory();

  const {
    setBookList,
  } = useBookList();

  useEffect(() => {
    setMode(null);
    setBookId(null);
    setCurrentIndex(0);
    setBookList();
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
      return <ReadingMode />;
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

    return <TogetherMode />;
  };

  return (
    <div className="w-screen h-screen">
      {content()}
    </div>
  );
}

export default Story;
