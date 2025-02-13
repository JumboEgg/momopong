import DrawingSelection from '@/components/drawing/modeSelection/DrawingTemplateSelection';
import DrawingModeSelection from '@/components/drawing/modeSelection/DrawingModeSelection';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DrawingPage from '@/components/drawing/drawingMode/DrawingPage';
import ResultPage from '@/components/drawing/drawingMode/ResultPage';
import FriendSelection from '@/components/stories/StoryMode/FriendSelection';
import StoryDrawingPage from '@/components/drawing/drawingMode/StroyDrawingPage';
import useSocketStore from '@/components/drawing/hooks/useSocketStore';
import { useFriends } from '@/stores/friendStore';
import { useDrawing } from '@/stores/drawing/drawingStore';
import { useSketchList } from '@/stores/drawing/sketchListStore';
import InvitationWaitPage from '../components/common/multiplayPages/invitationWaitPage';
import NetworkErrorPage from '../components/common/multiplayPages/networkerrorPage';

function Drawing() {
  const {
    mode, setMode, template, setTemplate, setPenColor, setIsErasing, imageData, setImageData,
  } = useDrawing();

  const { setSketchList } = useSketchList();
  const {
 friend, setFriend, isConnected, setIsConnected,
} = useFriends();
  const { socket, setConnect } = useSocketStore();
  const location = useLocation();
  const {
    waitingForResponse,
    templateId,
    templateName,
    isAccepted,
  } = location.state || {};

  // 초기화 useEffect
  useEffect(() => {
    if (templateId) {
      // SketchInfo 타입에 맞게 설정
      setTemplate({
        sketchId: templateId,
        sketchPath: '', // 빈 문자열로 설정
        sketchTitle: templateName || '함께 그리기',
      });
      setMode('together');
    } else {
      setMode(null);
      setTemplate(null);
      setSketchList();
    }

    setPenColor('black');
    setIsErasing(false);
    setImageData('');
  }, []);

  // 소켓 연결 관리
  useEffect(() => {
    if (mode === 'together') {
      if (waitingForResponse) {
        setConnect(false);
      } else if (isAccepted || !waitingForResponse) {
        setConnect(true);
      }
      setIsConnected(false);
      setFriend(null);
    }
  }, [mode, waitingForResponse, isAccepted]);

  const content = () => {
    if (!template) {
      return <DrawingSelection />;
    }

    if (!mode) {
      return <DrawingModeSelection />;
    }

    // 함께하기 모드일 때
    if (mode === 'together') {
      // 초대 대기중일 경우
      if (waitingForResponse) {
        return <InvitationWaitPage />;
      }

      if (!friend) {
        return <FriendSelection />;
      }

      if (friend && !socket) {
        return <NetworkErrorPage />;
      }

      if (friend && socket && !isConnected) {
        return <InvitationWaitPage />;
      }

      if (!imageData) {
        return <DrawingPage />;
      }
    }

    if (mode === 'single' && !imageData) {
      return <DrawingPage />;
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
