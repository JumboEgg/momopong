import DrawingSelection from '@/components/drawing/modeSelection/DrawingTemplateSelection';
import DrawingModeSelection from '@/components/drawing/modeSelection/DrawingModeSelection';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DrawingPage from '@/components/drawing/drawingMode/DrawingPage';
import ResultPage from '@/components/drawing/drawingMode/ResultPage';
import FriendSelection from '@/pages/FriendSelection';
import StoryDrawingPage from '@/components/drawing/drawingMode/StroyDrawingPage';
import InvitationWaitPage from '@/components/common/multiplayPages/InvitationWaitPage';
import NetworkErrorPage from '@/components/common/multiplayPages/NetworkerrorPage';
import useSocketStore from '@/components/drawing/hooks/useSocketStore';
import { useFriends } from '@/stores/friendStore';
import { useDrawing } from '@/stores/drawing/drawingStore';
import { useSketchList } from '@/stores/drawing/sketchListStore';
// import { Friend, StatusType } from '@/types/friend';

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
  const { socket, setConnect, isConnected: socketConnected } = useSocketStore();
  const location = useLocation();
  const {
    waitingForResponse,
    isAccepted,
  } = location.state || {};

  // socketStore의 연결 상태 변화를 friendStore에 동기화
  useEffect(() => {
    if (mode === 'together') {
      setIsConnected(socketConnected);
    }
  }, [socketConnected, mode]);

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

        if (socket && template) {
          const roomId = `drawing_${template.sketchId}`;
          socket.emit('join-room', roomId);
          console.log(`Joining room: ${roomId}`);

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

          return () => {
            socket.emit('leave-room', roomId);
          };
        }
      }
    }

    return undefined;
  }, [mode, isAccepted, location.state?.participantName, socket, template, friend]);

  const content = () => {
    if (!template) {
      return <DrawingSelection />;
    }

    if (!mode) {
      return <DrawingModeSelection />;
    }

    // 함께하기 모드일 때
    if (mode === 'together') {
      // 초대자 대기 상태
      if (waitingForResponse) {
        return <InvitationWaitPage />;
      }

    // 연결 준비 상태 (초대 수락 직후)
    if (isAccepted || location.state?.participantName) {
      if (!isConnected) {
        return (
          <InvitationWaitPage
            message="함께 그리기 준비 중이에요..."
            showTimer={false}
            duration={2}
            onComplete={() => setIsConnected(true)}
          />
        );
      }
    }

    // 친구 선택
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
      // console.log('Template data when rendering DrawingPage:', template); // template 데이터 확인
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
