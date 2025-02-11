// src/pages/TogetherMode.tsx
import {
  useState, useEffect, useRef, useCallback, useMemo,
} from 'react';
import { useLocation } from 'react-router-dom';
import { useFriends } from '@/stores/friendStore';
import { useStory } from '@/stores/storyStore';
import useSubAccountStore from '@/stores/subAccountStore';
import VideoRoom from '@/components/video/VideoRoom';
import storyData from '../data/cinderella';
import RecordingButton from './RecordingButton';
import AudioPlayer from '../AudioPlayer';
import { getAudioUrl } from '../utils/audioUtils';
import StoryIllustration from './StoryIllustration';

interface LocationState {
  roomName: string;
  participantName: string;
}

function TogetherMode() {
  const location = useLocation();
  const { roomName } = location.state as LocationState;
  const [isSessionEstablished, setIsSessionEstablished] = useState(false);

  const {
    currentIndex, setCurrentIndex, recordings, audioEnabled,
  } = useStory();

  const {
    friend,
  } = useFriends();
  const selectedAccount = useSubAccountStore((state) => state.selectedAccount);

  const [userRole, setUserRole] = useState<'prince' | 'princess' | null>(null);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [isLastAudioCompleted, setIsLastAudioCompleted] = useState(false);
  const audioRef = useRef(null);

  const currentPage = storyData[currentIndex];

  // LiveKit 세션 초기화
  useEffect(() => {
    const initializeSession = async () => {
      try {
        setIsSessionEstablished(true);
      } catch (error) {
        console.error('LiveKit 세션 초기화 실패:', error);
      }
    };

    initializeSession();
  }, [roomName]);

  if (!currentPage) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            페이지를 찾을 수 없습니다
          </h3>
        </div>
      </div>
    );
  }

  const currentContent = currentPage.contents[currentContentIndex];

  const isStoryEnd = useMemo(() => {
    if (!currentPage || currentIndex !== storyData.length - 1) return false;
    if (currentContentIndex !== currentPage.contents.length - 1) return false;

    // 마지막 페이지의 마지막 컨텐츠가 나레이션이고 오디오가 있는 경우
    const isLastContentNarration = currentContent?.type === 'narration'
      && currentContent?.audioId;

    // 나레이션이 아니거나 오디오가 없는 경우는 바로 종료
    if (!isLastContentNarration) return true;

    // 나레이션이고 오디오가 있는 경우는 오디오 완료 후 종료
    return isLastAudioCompleted;
  }, [currentIndex, currentContentIndex, currentPage, currentContent, isLastAudioCompleted]);

  const currentAudioUrl = useMemo(() => {
    if (!currentContent || !currentContent.audioId) {
      console.log('오디오 ID를 찾을 수 없습니다');
      return '';
    }

    return getAudioUrl(currentContent.audioId);
  }, [currentContent]);

  useEffect(() => {
    const randomRole = Math.random() < 0.5 ? 'prince' : 'princess';
    setUserRole(randomRole);
    console.log('선택된 역할:', randomRole);
  }, []);

  useEffect(() => {
    setIsLastAudioCompleted(false);
    console.log('현재 페이지:', currentPage);
    console.log('현재 컨텐츠:', currentContent);
  }, [currentIndex, currentContentIndex]);

  const isUserTurn = useMemo(() => {
    if (!userRole || !currentContent) return false;
    return currentContent.type === userRole;
  }, [userRole, currentContent]);

  const handleNext = useCallback(() => {
    if (!currentPage) return;

    if (currentContentIndex < currentPage.contents.length - 1) {
      setCurrentContentIndex((prev) => prev + 1);
    } else if (currentIndex < storyData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentContentIndex(0);
    }
  }, [currentIndex, currentContentIndex, currentPage, setCurrentIndex]);

  const handleRecordingComplete = useCallback(() => {
    setTimeout(handleNext, 1000);
  }, [handleNext]);

  const handleHomeClick = useCallback(() => {
    window.location.href = '/home';
  }, []);

  const handleAudioComplete = useCallback(() => {
    if (
      currentIndex === storyData.length - 1
      && currentContentIndex === currentPage.contents.length - 1
    ) {
      setIsLastAudioCompleted(true);
    } else {
      handleNext();
    }
  }, [currentIndex, currentContentIndex, currentPage.contents.length, handleNext]);

  const hasRecording = useCallback((index: number) => recordings.has(index), [recordings]);

  return (
    <div className="w-full h-screen relative">
      {/* 동화 컨텐츠 영역 */}
      <div className="w-full h-full px-6 pb-48 pt-6">
        <div className="mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">함께 읽는 신데렐라</h2>
            <p className="text-gray-600">
              내 역할:
              {userRole === 'prince' ? '왕자님' : '신데렐라'}
            </p>
            <p className="text-gray-600">
              함께 읽는 친구:
              {friend ? friend.name : ''}
            </p>
          </div>
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
          isLast={isStoryEnd}
          userRole={userRole || undefined}
          currentContent={currentContent}
          illustration={currentPage.illustration}
        />

        {/* 녹음 버튼과 오디오 플레이어 */}
        <div className="mt-4 flex justify-center">
          {isUserTurn ? (
            <div className="mt-4">
              {!hasRecording(currentIndex) && (
                <RecordingButton
                  characterType={currentContent.type}
                  storyIndex={currentIndex}
                  onRecordingComplete={handleRecordingComplete}
                />
              )}
            </div>
          ) : (
            audioEnabled && currentAudioUrl && (
              <div className="hidden">
                <AudioPlayer
                  ref={audioRef}
                  audioFiles={[currentAudioUrl]}
                  autoPlay
                  onEnded={handleAudioComplete}
                />
              </div>
            )
          )}
        </div>
      </div>

      {/* 화상 비디오 영역 */}
      {isSessionEstablished && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-between items-center px-8 z-50">
          <VideoRoom
            roomName={roomName}
            participantName={selectedAccount?.name}
          />
        </div>
      )}

      {/* 이야기 종료 오버레이 */}
      {isStoryEnd && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50" />
          <div className="bg-white rounded-lg p-8 shadow-xl max-w-sm w-full mx-4 z-50 relative">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              함께했던 스토리는 나의집에서 다시볼수있어!
            </h3>
            <p className="text-gray-600 mb-8 text-center">
              다음에 또만나자~
            </p>
            <button
              type="button"
              onClick={handleHomeClick}
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium"
            >
              홈으로 가기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TogetherMode;
