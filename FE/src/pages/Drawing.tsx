import DrawingSelection from '@/components/drawing/modeSelection/DrawingTemplateSelection';
import DrawingModeSelection from '@/components/drawing/modeSelection/DrawingModeSelection';
import { useEffect } from 'react';
import DrawingPage from '@/components/drawing/drawingMode/DrawingPage';
import ResultPage from '@/components/drawing/drawingMode/ResultPage';
import FriendSelection from '@/components/stories/StoryMode/FriendSelection';
import StoryDrawingPage from '@/components/drawing/drawingMode/StroyDrawingPage';
import { useDrawing } from '@/stores/drawing/drawingStore';
import useSocketStore from '@/components/drawing/hooks/useSocketStore';
import { useFriends } from '@/stores/friendStore';
import { useSketchList } from '@/stores/drawing/sketchListStore';
import InvitationWaitPage from '../components/common/multiplayPages/invitationWaitPage';
import NetworkErrorPage from '../components/common/multiplayPages/networkerrorPage';

function Drawing() {
  const {
    mode, setMode, template, setTemplate, setPenColor, setIsErasing, imageData, setImageData,
  } = useDrawing();

  const {
    setSketchList,
  } = useSketchList();

  useEffect(() => {
    setMode(null);
    setTemplate(null);
    setPenColor('black');
    setIsErasing(false);
    setImageData('');
    setSketchList();
  }, []);

  const {
    friend, setFriend, isConnected, setIsConnected,
  } = useFriends();

  const {
    socket, setConnect,
  } = useSocketStore();

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
          <FriendSelection />
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
    <div className="w-screen h-screen">
      {content()}
    </div>
  );
}
export default Drawing;
