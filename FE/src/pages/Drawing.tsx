import DrawingSelection from '@/components/drawing/modeSelection/DrawingTemplateSelection';
import DrawingModeSelection from '@/components/drawing/modeSelection/DrawingModeSelection';
import { useEffect, useState } from 'react';
import DrawingPage from '@/components/drawing/drawingMode/DrawingPage';
import ResultPage from '@/components/drawing/drawingMode/ResultPage';
import FriendSelection from '@/components/stories/StoryMode/FriendSelection';
// import { FriendProvider } from '@/components/stories/contexts/FriendContext';
import StoryDrawingPage from '@/components/drawing/drawingMode/StroyDrawingPage';
import { useDrawing } from '@/stores/drawingStore';
import useSocketStore from '@/components/drawing/hooks/useSocketStore';
import { useFriends } from '@/stores/friendStore';
import InvitationWaitPage from '../components/common/multiplayPages/invitationWaitPage';
import NetworkErrorPage from '../components/common/multiplayPages/networkerrorPage';

function Drawing() {
  const {
    mode, setMode, template, setTemplate, setPenColor, setIsErasing, imageData, setImageData,
  } = useDrawing();

  const {
    friend, setFriend, isConnected, setIsConnected,
  } = useFriends();

  useEffect(() => {
    setMode(null);
    setTemplate(null);
    setPenColor('black');
    setIsErasing(false);
    setImageData('');
  }, []);

  const {
    socket, setConnect,
  } = useSocketStore();

  const [selectedFriendId, setSelectedFriendId] = useState<string>();
  if (false) console.log(selectedFriendId);

  useEffect(() => {
    // setConnect(false);
    setConnect(true);
    setIsConnected(false);
    setFriend(null);
  }, [mode]);

  const content = () => {
    if (!template) {
      return <DrawingSelection />;
    }

    if (!mode) {
      return <DrawingModeSelection />;
    }

    if (mode === 'single' && !imageData) {
      return (
        <DrawingPage />
      );
    }

    if (mode === 'together') {
      if (!friend) {
        return (
          <FriendSelection onFriendSelect={setSelectedFriendId} />
        );
      } if (friend && !socket) {
        return (
          <NetworkErrorPage />
        );
      } if (friend && socket && !isConnected) {
        return (
          <InvitationWaitPage />
        );
      }
      if (!imageData) {
        return (
          <DrawingPage />
        );
      }
    }

    if (mode === 'story' && !imageData) {
      return <StoryDrawingPage />;
    }

    return <ResultPage />;
  };

  return (
    <div className="w-full h-full">
      {content()}
    </div>
  );
}
export default Drawing;
