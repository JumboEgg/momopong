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
// import { Friend, StatusType } from '@/types/friend';
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
    isAccepted,
  } = location.state || {};

   // 기본 초기화용 useEffect
   useEffect(() => {
    // console.log('Effect triggered');
    // console.log('Current location.state:', location.state);

    if (location.state?.templateId) {
      // console.log('Setting template with:', location.state.templateId);
      setTemplate({
        sketchId: location.state.templateId,
        sketchPath: '',
        sketchTitle: location.state.templateName || '함께 그리기',
      });
      setMode('together');
      // console.log('Template should be set now');
    } else if (!location.state) {
      // console.log('Initializing states to null');
      setMode(null);
      setTemplate(null);
      setSketchList();
    }

    setPenColor('black');
    setIsErasing(false);
    setImageData('');
  }, [location.state]);

  // 소켓 연결 관리
  useEffect(() => {
    if (mode === 'together') {
      console.log('location.state:', location.state);
      if (waitingForResponse) {
        setConnect(false);
        setIsConnected(false);
      } else if (isAccepted || location.state?.participantName) {
        setConnect(true);
        setIsConnected(false);
        const participantName = location.state?.participantName;
        if (participantName && !friend) {
          setFriend({
            id: location.state?.participantId,
            childId: location.state?.participantId,
            name: participantName,
            profile: location.state?.participantProfile || '',
            status: 'DRAWING', // StatusType의 literal type 중 하나
          });
        }
      } else {
        setFriend(null);
        setConnect(false);
        setIsConnected(false);
      }
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
      if (waitingForResponse) {
        return <InvitationWaitPage />;
      }

      // 초대가 수락되었거나 초대받은 상태에서는 friend가 설정되어 있어야 함
      if (!friend) {
        if (isAccepted || location.state?.participantName) {
          // friend 정보 설정이 필요한 상태
          return <InvitationWaitPage />; // 또는 다른 로딩 상태
        }
        return <FriendSelection />;
      }

      if (friend && !socket) {
        return <NetworkErrorPage />;
      }

      if (friend && socket && !isConnected) {
        return <InvitationWaitPage />;
      }

      if (!imageData) {
        console.log('Template data when rendering DrawingPage:', template); // template 데이터 확인
        return <DrawingPage />;
      }
    }

    // 싱글모드
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
