import DrawingSelection from '@/components/drawing/modeSelection/DrawingTemplateSelection';
import DrawingModeSelection from '@/components/drawing/modeSelection/DrawingModeSelection';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DrawingPage from '@/components/drawing/drawingMode/DrawingPage';
import ResultPage from '@/components/drawing/drawingMode/ResultPage';
import FriendSelection from '@/components/stories/StoryMode/FriendSelection';
import StoryDrawingPage from '@/components/drawing/drawingMode/StroyDrawingPage';
import { useDrawing } from '@/stores/drawingStore';
import useSocketStore from '@/components/drawing/hooks/useSocketStore';
import { useFriends } from '@/stores/friendStore';
import InvitationWaitPage from '../components/common/multiplayPages/invitationWaitPage';
import NetworkErrorPage from '../components/common/multiplayPages/networkerrorPage';

function Drawing() {
  const location = useLocation();
  const { waitingForResponse, templateId } = location.state || {};

  const {
    mode, setMode, template, setTemplate, setPenColor, setIsErasing, imageData, setImageData,
  } = useDrawing();

  const { friend, setFriend } = useFriends();
  const { socket, setConnect } = useSocketStore();

  // 초기 마운트시 상태 초기화
  useEffect(() => {
    if (templateId) {
      // 템플릿 설정
      setTemplate({
        id: templateId,
        name: location.state?.templateName || '함께 그리기',
        backgroundSrc: '',
        outlineSrc: '',
      });
      setMode('together');
    } else {
      setMode(null);
      setTemplate(null);
    }

    setPenColor('black');
    setIsErasing(false);
    setImageData('');
    setFriend(null);

    // 소켓 연결 관리
    if (waitingForResponse) {
      setConnect(false); // 응답 대기 중일 때는 연결 해제
    }
  }, [templateId, waitingForResponse]);

  const content = () => {
    if (!template) return <DrawingSelection />;
    if (!mode) return <DrawingModeSelection />;

    // single 모드
    if (mode === 'single') {
      return !imageData ? <DrawingPage /> : <ResultPage />;
    }

    // together 모드
    if (mode === 'together') {
      if (waitingForResponse) {
        return <InvitationWaitPage />;
      }

      if (!friend) {
        return <FriendSelection />;
      }

      if (!socket) {
        return <NetworkErrorPage />;
      }

      return !imageData ? <DrawingPage /> : <ResultPage />;
    }

    // story 모드
    if (mode === 'story') {
      return !imageData ? <StoryDrawingPage /> : <ResultPage />;
    }

    return <DrawingSelection />;
  };

  return (
    <div className="w-screen h-screen">
      {content()}
    </div>
  );
}

export default Drawing;
