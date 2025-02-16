import { useState, useEffect } from 'react';
import { RoomEvent } from 'livekit-client';
import { useRoomStore } from '@/stores/roomStore';
import { useLocation, useNavigate } from 'react-router-dom';
import useSubAccountStore from '@/stores/subAccountStore';
import IntegratedRoom from '../components/stories/StoryMode/IntegratedRoom';

interface GreetingPageProps {
  onBothReady: () => void;
}

function GreetingPage({ onBothReady }: GreetingPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomName, isInvitationAccepted, contentId } = location.state as {
    roomName: string;
    isInvitationAccepted?: boolean;
    contentId?: number;
  };
  const selectedAccount = useSubAccountStore((state) => state.selectedAccount);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isReady, setIsReady] = useState(false);
  const {
    sendReadyStatus,
    partnerReady,
    confirmReady,
    readyConfirmed,
    setPartnerReady,
    room,
  } = useRoomStore();

  // 초대 수락으로 들어온 경우 추가 로직
  useEffect(() => {
    if (isInvitationAccepted) {
      console.log('초대 수락으로 인사방 입장');
      // 필요한 추가 초기화 로직 수행
    }
  }, [isInvitationAccepted]);

  // 데이터 리스너 추가
// GreetingPage.tsx 내의 useEffect 훅에서
useEffect(() => {
  if (!room) return;

  const handleDataReceived = (payload: Uint8Array) => {
    try {
      const message = JSON.parse(new TextDecoder().decode(payload));
      console.log('🌈 Received Data Message:', message);

      if (message.type === 'ready_status') {
        console.log('📣 Received Ready Status', {
          status: message.status,
          sender: message.sender,
        });
        // 여기에 상대방 준비완료 메시지 추가
        if (message.status) {
          console.log('🎉 상대방 준비완료!!');
        }
        setPartnerReady(message.status);
      } else if (message.type === 'start_story') {
        console.log('🚀 Received Start Story', {
          status: message.status,
          sender: message.sender,
        });
        confirmReady(true);
      }
    } catch (error) {
      console.error('데이터 처리 오류:', error);
    }
  };

  room.on(RoomEvent.DataReceived, handleDataReceived);

  return () => {
    room.off(RoomEvent.DataReceived, handleDataReceived);
  };
}, [room, setPartnerReady, confirmReady]);

  const handleReady = () => {
    console.log('🎯 handleReady 호출', {
      timeLeft,
      isReady,
      partnerReady,
      currentRoom: room ? {
        name: room.name,
        state: room.state,
      } : 'null',
    });

    if (timeLeft > 0 && !isReady) {
      // 1. 먼저 자신의 ready 상태를 true로 설정
      setIsReady(true);
      sendReadyStatus(true);

      // 2. 만약 상대방이 이미 ready 상태라면
      if (partnerReady) {
        console.log('🤝 Both users are now ready, confirming start');

        // 3. 양쪽 모두 ready 상태이므로 story 시작을 confirm
        confirmReady(true);

        // 4. 상대방에게도 story 시작을 알림
        if (room) {
          const message = {
            type: 'start_story',
            status: true,
            sender: room.localParticipant.identity,
          };

          room.localParticipant.publishData(
            new TextEncoder().encode(JSON.stringify(message)),
            { reliable: true },
          );
        }
      }
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 파트너의 준비 상태 및 스토리 시작 확인
  useEffect(() => {
    console.log('Status Check Effect');
    console.log('Room Name:', roomName);
    console.log('isReady:', isReady);
    console.log('partnerReady:', partnerReady);
    console.log('readyConfirmed:', readyConfirmed);
    console.log('초대 상태 체크', {
      isReady, // 내 준비 상태
      partnerReady, // 상대방 준비 상태
      readyConfirmed, // 전체 준비 확정 상태
    });
    if (isReady && partnerReady) {
      console.log('🤝 Both users are ready');
      // 추가: 명시적으로 스토리 시작 메시지 송신
      if (room) {
        const message = {
          type: 'start_story',
          status: true,
          sender: room.localParticipant.identity,
        };

        room.localParticipant.publishData(
          new TextEncoder().encode(JSON.stringify(message)),
          { reliable: true },
        );
      }

      // onBothReady 대신 직접 confirmReady 호출
      confirmReady(true);
    }

    // 둘 다 준비되고, 스토리 시작 확정된 경우
    if (readyConfirmed) {
      console.log('🚀 Navigating to TogetherMode', {
        roomName,
        participantName: selectedAccount?.name,
      });
      navigate(`/book/${contentId}/together`, {
        state: {
          roomName,
          participantName: selectedAccount?.name,
          isStoryStarted: true,
        },
      });
    }
  }, [
    isReady,
    partnerReady,
    onBothReady,
    readyConfirmed,
    navigate,
    roomName,
    selectedAccount,
    confirmReady,
  ]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 text-center w-full max-w-md mb-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">인사 시간</h2>
        <p className="text-lg mb-6 text-gray-600">
          남은 시간:
          <span className="font-bold text-blue-600 ml-2">
            {timeLeft}
            초
          </span>
        </p>

        <button
          type="button"
          onClick={handleReady}
          disabled={isReady || timeLeft === 0}
          className={`
            w-full py-3 rounded-lg font-semibold text-white transition-colors
            ${isReady || timeLeft === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
            }
          `}
        >
          {isReady ? '대기 중...' : '시작하기'}
        </button>

        {isReady && partnerReady && (
          <p className="mt-4 text-green-600 font-medium">
            준비 완료! 곧 동화가 시작됩니다.
          </p>
        )}

        {timeLeft === 0 && !isReady && (
          <p className="mt-4 text-red-600 font-medium">
            시간이 초과되었습니다.
          </p>
        )}
      </div>

      {/* 화상 비디오 영역 */}
      <IntegratedRoom
        roomName={roomName}
        participantName={selectedAccount?.name || 'Anonymous'}
        userRole={selectedAccount?.name?.includes('왕자') ? 'role2' : 'role1'}
        isUserTurn
        onRecordingComplete={() => {}}
        onRecordingStatusChange={() => {}}
        variant="greeting"  // 이 prop 추가
      />
    </div>
  );
}

export default GreetingPage;
