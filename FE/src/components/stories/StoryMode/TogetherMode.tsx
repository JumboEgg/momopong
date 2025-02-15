import {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useLocation } from 'react-router-dom';
import { useStory } from '@/stores/storyStore';
import { useRoomStore } from '@/stores/roomStore'; // ✅ LiveKit 상태 추가
import { useFriends } from '@/stores/friendStore';
import useSubAccountStore from '@/stores/subAccountStore';
import { useBookContent } from '@/stores/book/bookContentStore';
import IntegratedRoom from './IntegratedRoom';
import AudioPlayer from '../AudioPlayer';
import StoryIllustration from './StoryIllustration';
import storyData from '../data/cinderella';

interface LocationState {
  roomName: string;
  participantName: string;
}

interface RecordingState {
  [participantId: string]: {
    isRecording: boolean;
    isCompleted: boolean;
  };
}

function TogetherMode() {
  // 방 이름 관리
  const location = useLocation();
  const { roomName } = location.state as LocationState;
  
  // LiveKit에서 페이지 동기화 관리
  const { currentPage, sendPageUpdate } = useRoomStore();
  
  // 친구, 책 컨텐츠, 서브 계정, 스토리 상태 가져오기
  const { friend } = useFriends();
  const { bookContent } = useBookContent();
  const selectedAccount = useSubAccountStore((state) => state.selectedAccount);
  const { currentIndex, setCurrentIndex, audioEnabled } = useStory();

  // 상태 관리
  const [userRole, setUserRole] = useState<'role2' | 'role1' | null>(null);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [recordingStates, setRecordingStates] = useState<RecordingState>({});
  const [isWaitingForOther, setIsWaitingForOther] = useState(false);

  // 현재 페이지 및 컨텐츠 계산
  const currentPageData = bookContent?.pages[currentIndex];
  const currentContent = currentPageData?.audios[currentContentIndex];

  // 역할 초기 설정
  useEffect(() => {
    const randomRole = Math.random() < 0.5 ? 'role2' : 'role1';
    setUserRole(randomRole);
  }, []);

  // 현재 사용자 차례 확인
  const isUserTurn = useMemo(() => {
    if (!userRole || !currentContent) return false;
    return currentContent.role === userRole;
  }, [userRole, currentContent]);

  /**
   * 🔄 LiveKit에서 받은 `currentPage`를 현재 사용자의 `currentIndex`에 반영
   */
  useEffect(() => {
    if (currentPage !== currentIndex) {
      console.log(`🔄 페이지 동기화: ${currentPage} → ${currentIndex}`);
      setCurrentIndex(currentPage);
      setCurrentContentIndex(0);
    }
  }, [currentPage, currentIndex, setCurrentIndex]);

  /**
   * ✅ 다음 페이지/컨텐츠로 이동하며 LiveKit에 변경 전송
   */
  const handleNext = useCallback(() => {
    if (!currentPageData) return;

    // 녹음 상태 초기화
    setRecordingStates({});
    setIsWaitingForOther(false);

    if (currentContentIndex < currentPageData.audios.length - 1) {
      setCurrentContentIndex((prev) => prev + 1);
    } else if (currentIndex < storyData.length - 1) {
      const nextPage = currentIndex + 1;
      
      // ✅ 다음 페이지로 이동
      setCurrentIndex(nextPage);
      setCurrentContentIndex(0);

      // ✅ LiveKit을 통해 페이지 변경 브로드캐스트
      sendPageUpdate(nextPage);
    }
  }, [currentIndex, currentContentIndex, currentPageData, setCurrentIndex, sendPageUpdate]);

  // 녹음 상태 변경 처리
  const handleRecordingStateChange = useCallback(
    (participantId: string, status: 'idle' | 'recording' | 'completed') => {
      setRecordingStates((prev) => ({
        ...prev,
        [participantId]: {
          isRecording: status === 'recording',
          isCompleted: status === 'completed',
        },
      }));
    },
    [],
  );

  // 모든 참가자의 녹음 완료 여부 확인
  useEffect(() => {
    const allParticipantsCompleted = Object.values(recordingStates).every(
      (state) => state.isCompleted
    );

    if (allParticipantsCompleted && Object.keys(recordingStates).length > 0) {
      if (currentContentIndex < (currentPageData?.audios.length ?? 0) - 1) {
        setCurrentContentIndex((prev) => prev + 1);
      } else if (currentIndex < storyData.length - 1) {
        const nextPage = currentIndex + 1;
        
        // ✅ 다음 페이지로 이동
        setCurrentIndex(nextPage);
        setCurrentContentIndex(0);

        // ✅ LiveKit을 통해 페이지 변경 브로드캐스트
        sendPageUpdate(nextPage);
      }

      setRecordingStates({});
      setIsWaitingForOther(false);
    }
  }, [recordingStates, currentIndex, currentContentIndex, currentPageData]);

  // 내레이션 오디오 완료 처리
  const handleNarrationComplete = useCallback(() => {
    handleNext();
  }, [handleNext]);

  const handleRecordingComplete = useCallback((participantId: string, audioBlob?: Blob) => {
    console.log('녹음 완료:', participantId, audioBlob);

    setRecordingStates((prev) => ({
      ...prev,
      [participantId]: {
        isRecording: false,
        isCompleted: true,
        audioBlob,
      },
    }));

    setIsWaitingForOther(true);
  }, []);

  return (
    <div className="w-full h-screen relative">
      <div className="w-full h-full px-6 pb-48 pt-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">함께 읽는 신데렐라</h2>
          <p className="text-gray-600">내 역할: {userRole === 'role2' ? '왕자님' : '신데렐라'}</p>
          <p className="text-gray-600">함께 읽는 친구: {friend?.name || ''}</p>
        </div>

        <StoryIllustration
          currentContentIndex={currentContentIndex}
          onPrevious={() => {
            if (currentIndex > 0) {
              setCurrentIndex(currentIndex - 1);
              setCurrentContentIndex(0);
              sendPageUpdate(currentIndex - 1); // ✅ 이전 페이지 전송
            }
          }}
          onNext={handleNext}
          userRole={userRole || undefined}
          currentContent={currentContent}
          illustration={currentPageData?.pagePath ?? ''}
          totalPages={storyData.length}
        />

        {isWaitingForOther && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-800 px-6 py-3 rounded-full shadow-lg">
            상대방의 녹음이 끝날 때까지 기다려주세요...
          </div>
        )}

        {currentContent?.role === 'narration' && audioEnabled && currentContent.order && (
          <div className="hidden">
            <AudioPlayer
              audioFiles={[currentContent.path ?? '']}
              autoPlay
              onEnded={handleNarrationComplete}
              onError={handleNext}
            />
          </div>
        )}
      </div>
      {userRole && (
        <IntegratedRoom
          roomName={roomName}
          participantName={selectedAccount?.name || 'Anonymous'}
          userRole={userRole}
          isUserTurn={isUserTurn}
          onRecordingComplete={handleRecordingComplete}
          onRecordingStatusChange={handleRecordingStateChange}
        />
      )}
    </div>
  );
}

export default TogetherMode;
