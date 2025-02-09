import { useEffect } from 'react';
import ReadingMode from '@/components/stories/StoryMode/ReadingMode';
import TogetherMode from '@/components/stories/TogetherMode/TogetherMode';
import StorySelection from '@/components/stories/StoryMode/StorySelection';
import ModeSelection from '@/components/stories/ModeSelection/ModeSelection';
import { useFriends } from '@/stores/friendStore';
import FriendSelection from '@/components/stories/StoryMode/FriendSelection';
import { useStory } from '@/stores/storyStore';
import useSocketStore from '@/components/drawing/hooks/useSocketStore';
import InvitationWaitPage from '@/components/common/multiplayPages/invitationWaitPage';
import NetworkErrorPage from '@/components/common/multiplayPages/networkerrorPage';

function Story() {
  const {
    mode, setMode, storyId, setStoryId, setCurrentIndex,
  } = useStory();

  useEffect(() => {
    setMode(null);
    setStoryId(null);
    setCurrentIndex(0);
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
    if (!storyId) {
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
    <div>
      {content()}
    </div>
  );
}

export default Story;
