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
import InvitationWaitPage from '@/components/common/multiplayPages/InvitationWaitPage';
import NetworkErrorPage from '../components/common/multiplayPages/NetworkerrorPage';

const getTemplateFilename = (id: number): string => {
  const fileMap: Record<number, string> = {
    1: 'boilthewitch.webp',
    2: 'cardsoldiers.webp',
    3: 'cinderella.webp',
    4: 'cookiehouse.webp',
    5: 'frooog.webp',
    6: 'grillthemermaid.webp',
    7: 'peavine.webp',
    8: 'prince.webp',
    9: 'pumpkinmagic.webp',
    10: 'runningbunny.webp',
    11: 'shoemakerelves.webp',
    12: 'thepremiumshoe.webp',
    13: 'theshoe.webp',
  };

  return fileMap[id] || '';
};

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
    if (location.state?.templateId) {
      // 한 번만 설정되도록
      if (!template || template.sketchId !== location.state.templateId) {
        setTemplate({
          sketchId: location.state.templateId,
          sketchPath: getTemplateFilename(location.state.templateId),
          sketchTitle: location.state.templateName || '함께 그리기',
        });
        setMode('together');
      }
    } else if (!location.state) {
      setMode(null);
      setTemplate(null);
      setSketchList();
      setPenColor('black');
      setIsErasing(false);
      setImageData('');
    }
  }, [location.state]);

  // 소켓 연결 관리
  // 기본 초기화용 useEffect는 그대로 유지

  // 소켓 연결 관리
  useEffect(() => {
    if (mode === 'together') {
      const isParticipating = isAccepted || location.state?.participantName;

      if (isParticipating) {
        setConnect(true);

        // 소켓과 템플릿이 모두 있을 때만 방 입장 처리
        if (socket && template) {
          const roomId = `drawing_${template.sketchId}`;
          socket.emit('join-room', roomId);
          console.log(`Joining room: ${roomId}`);

          // 소켓 이벤트 리스너 설정
          socket.on('room-joined', () => {
            setIsConnected(true);
            console.log('Successfully joined room');
          });

          socket.on('join-room-error', (error) => {
            console.error('Failed to join room:', error);
            setIsConnected(false);
          });

          // friend 정보 설정
          if (location.state?.participantName && !friend) {
            setFriend({
              id: location.state?.participantId,
              childId: location.state?.participantId,
              name: location.state?.participantName,
              profile: location.state?.participantProfile || '',
              status: 'DRAWING',
            });
          }

          // Cleanup
          return () => {
            socket.emit('leave-room', roomId);
            socket.off('room-joined');
            socket.off('join-room-error');
            setIsConnected(false);
          };
        }
      }
    }

    // 항상 cleanup 함수 반환
    return () => {
      if (socket) {
        setIsConnected(false);
      }
    };
  }, [mode, isAccepted, location.state?.participantName, socket, template, friend]); // 의존성 배열 추가

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
