// 수정한거임
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useLocation } from 'react-router-dom';
import { useStory } from '@/stores/storyStore';
import { useFriends } from '@/stores/friendStore';
import useSubAccountStore from '@/stores/subAccountStore';

import IntegratedRoom from './IntegratedRoom';
import AudioPlayer from '../AudioPlayer';
import StoryIllustration from './StoryIllustration';
import storyData from '../data/cinderella';
import { getAudioUrl } from '../utils/audioUtils';

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
  const location = useLocation();
  const { roomName } = location.state as LocationState;
  const { friend } = useFriends();
  const selectedAccount = useSubAccountStore((state) => state.selectedAccount);
  const { currentIndex, setCurrentIndex, audioEnabled } = useStory();

  // 상태 관리
  const [userRole, setUserRole] = useState<'prince' | 'princess' | null>(null);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [recordingStates, setRecordingStates] = useState<RecordingState>({});
  const [isWaitingForOther, setIsWaitingForOther] = useState(false);

  // 현재 페이지 및 컨텐츠 계산
  const currentPage = storyData[currentIndex];
  const currentContent = currentPage?.contents[currentContentIndex];

  // 역할 초기 설정
  useEffect(() => {
    const randomRole = Math.random() < 0.5 ? 'prince' : 'princess';
    setUserRole(randomRole);
  }, []);

  // 현재 사용자 차례 확인
  const isUserTurn = useMemo(() => {
    if (!userRole || !currentContent) return false;
    return currentContent.type === userRole;
  }, [userRole, currentContent]);

  // 다음 페이지/컨텐츠로 이동
  const handleNext = useCallback(() => {
    if (!currentPage) return;

    // 녹음 상태 초기화
    setRecordingStates({});
    setIsWaitingForOther(false);

    if (currentContentIndex < currentPage.contents.length - 1) {
      setCurrentContentIndex((prev) => prev + 1);
    } else if (currentIndex < storyData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentContentIndex(0);
    }
  }, [currentIndex, currentContentIndex, currentPage, setCurrentIndex]);

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
    const allParticipantsCompleted = Object.values(
      recordingStates,
    ).every((state) => state.isCompleted);

    // 최소한 한 명이 녹음을 완료했고, 모든 참가자가 완료했을 때
    if (allParticipantsCompleted && Object.keys(recordingStates).length > 0) {
      // 현재 페이지의 모든 컨텐츠를 확인
      if (currentContentIndex < currentPage.contents.length - 1) {
        // 아직 페이지 내 다음 컨텐츠가 있다면 다음 컨텐츠로 이동
        setCurrentContentIndex((prev) => prev + 1);
      } else if (currentIndex < storyData.length - 1) {
        // 페이지 내 컨텐츠를 모두 완료했다면 다음 페이지로 이동
        setCurrentIndex(currentIndex + 1);
        setCurrentContentIndex(0);
      }

      // 녹음 상태 초기화
      setRecordingStates({});
      setIsWaitingForOther(false);
    }
  }, [recordingStates, currentIndex, currentContentIndex, currentPage]);

  // 내레이션 오디오 완료 처리
  const handleNarrationComplete = useCallback(() => {
    handleNext();
  }, [handleNext]);

  const handleRecordingComplete = useCallback(
    (participantId: string, audioBlob?: Blob) => {
      // 녹음된 오디오 blob 처리
      console.log('녹음 완료:', participantId, audioBlob);

      // 녹음 상태 업데이트
      setRecordingStates((prev) => ({
        ...prev,
        [participantId]: {
          isRecording: false,
          isCompleted: true,
          audioBlob, // 오디오 blob 저장
        },
      }));

      // 대기 상태 설정
      setIsWaitingForOther(true);
    },
    [],
  );

  return (
    <div className="w-full h-screen relative">
      {/* 동화 컨텐츠 영역 */}
      <div className="w-full h-full px-6 pb-48 pt-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            함께 읽는 신데렐라
          </h2>
          <p className="text-gray-600">
            내 역할:
            {userRole === 'prince' ? '왕자님' : '신데렐라'}
          </p>
          <p className="text-gray-600">
            함께 읽는 친구:
            {friend?.name || ''}
          </p>
        </div>

        <StoryIllustration
          pageNumber={currentPage.pageNumber}
          currentContentIndex={currentContentIndex}
          onPrevious={() => {
            if (currentIndex > 0) {
              setCurrentIndex(currentIndex - 1);
              setCurrentContentIndex(0);
            }
          }}
          onNext={handleNext}
          isFirst={currentIndex === 0}
          isLast={currentIndex === storyData.length - 1}
          userRole={userRole || undefined}
          currentContent={currentContent}
          illustration={currentPage.illustration}
        />

        {/* 녹음 대기 상태 표시 */}
        {isWaitingForOther && (
          <div
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-800 px-6 py-3 rounded-full shadow-lg"
          >
            상대방의 녹음이 끝날 때까지 기다려주세요...
          </div>
        )}

        {/* 오디오 플레이어 (내레이션) */}
        {currentContent?.type === 'narration' && audioEnabled && currentContent.audioId && (
          <div className="hidden">
            <AudioPlayer
              audioFiles={[getAudioUrl(currentContent.audioId)]}
              autoPlay
              onEnded={handleNarrationComplete}
              onError={() => {
                console.error('Audio playback failed');
                handleNext();
              }}
            />
          </div>
        )}
      </div>

      {/* 화상 비디오 영역 */}
      {userRole && (
        <IntegratedRoom
          roomName={roomName}
          participantName={selectedAccount?.name || 'Anonymous'}
          userRole={userRole}
          isUserTurn={isUserTurn}
          onRecordingComplete={handleRecordingComplete}
          onRecordingStatusChange={(participantId: string, status) => {
            handleRecordingStateChange(participantId, status);
          }}
        />
      )}
    </div>
  );
}

export default TogetherMode;
