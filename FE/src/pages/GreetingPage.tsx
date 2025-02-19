import { useState, useEffect, useMemo } from 'react';
import { RoomEvent } from 'livekit-client';
import { useRoomStore } from '@/stores/roomStore';
import { useLocation, useNavigate } from 'react-router-dom';
import useSubAccountStore from '@/stores/subAccountStore';
import { useRoleStore } from '@/stores/roleStore';
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
  const [isReady, setIsReady] = useState(false);
  const {
    sendReadyStatus,
    partnerReady,
    confirmReady,
    readyConfirmed,
    setPartnerReady,
    room,
  } = useRoomStore();

  const { role1UserId, role2UserId } = useRoleStore();
  const myId = useSubAccountStore.getState().selectedAccount?.childId ?? 0;

  const determineUserRole = (userId: number | null, r1UserId: number | null) => {
    console.log('🎭 Role Determination Debug:', {
      userId,
      role1UserId: r1UserId,
      calculatedRole: userId === r1UserId ? 'role1' : 'role2',
    });

    if (userId === null || r1UserId === null) return 'role1';
    return userId === r1UserId ? 'role1' : 'role2';
  };

  const myRole = useMemo(() => {
    const role = determineUserRole(myId, role1UserId);
    console.log('✨ Final Role Assignment:', {
      myId,
      role1UserId,
      role2UserId,
      assignedRole: role,
    });
    return role;
  }, [myId, role1UserId]);

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

  // eslint-disable-next-line consistent-return
  return () => {
    room.off(RoomEvent.DataReceived, handleDataReceived);
  };
}, [room, setPartnerReady, confirmReady]);

  const handleReady = () => {
    console.log('🎯handleReady 호출', {
      isReady,
      partnerReady,
      currentRoom: room ? {
        name: room.name,
        state: room.state,
      } : 'null',
    });

    if (!isReady) {
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
    if (isReady && partnerReady && !readyConfirmed) {
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
          userRole: myRole, // 역할 정보 추가
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
    <div className="flex flex-col h-screen bg-gray-100">
      {/* 헤더 */}
      <div className="w-full bg-white shadow-sm py-6">
        <h1 className="text-center text-2xl font-semibold text-gray-800">
          함께 동화를 읽을 친구와 짧게 인사해 봅시다
        </h1>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 relative">
        {/* 비디오 영역 */}
        <div className="absolute inset-0">
          <IntegratedRoom
            roomName={roomName}
            participantName={selectedAccount?.name || 'Anonymous'}
            userRole={myRole}
            isUserTurn
            onRecordingComplete={() => {}}
            onRecordingStatusChange={() => {}}
            variant="greeting"
          />
        </div>

        {/* 중앙 버튼 컨테이너 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/40 shadow-lg rounded-lg p-6 backdrop-blur-sm pointer-events-auto text-center">
            <button
              type="button"
              onClick={handleReady}
              disabled={isReady}
              className={`
                px-8 py-3 rounded-lg font-semibold text-white transition-colors
                ${isReady
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default GreetingPage;
