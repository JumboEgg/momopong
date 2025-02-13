import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
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

function TogetherMode() {
  const location = useLocation();
  const { roomName } = location.state as LocationState;

  // 상태 관리
  const [userRole, setUserRole] = useState<'prince' | 'princess' | null>(null);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [isLastAudioCompleted, setIsLastAudioCompleted] = useState(false);

  // 스토어에서 상태 가져오기
  const {
    currentIndex,
    setCurrentIndex,
    audioEnabled,
  } = useStory();

  const { friend } = useFriends();
  const selectedAccount = useSubAccountStore((state) => state.selectedAccount);

  const audioRef = useRef<HTMLAudioElement>(null);

  // 현재 페이지 및 컨텐츠 계산
  const currentPage = storyData[currentIndex];
  const currentContent = currentPage?.contents[currentContentIndex];

  // 페이지 초기 설정
  useEffect(() => {
    const randomRole = Math.random() < 0.5 ? 'prince' : 'princess';
    setUserRole(randomRole);
    console.log('선택된 역할:', randomRole);
  }, []);

  // 페이지 변경 시 상태 초기화
  useEffect(() => {
    setIsLastAudioCompleted(false);
  }, [currentIndex, currentContentIndex]);

  // 현재 사용자 차례 확인
  const isUserTurn = useMemo(() => {
    if (!userRole || !currentContent) return false;
    return currentContent.type === userRole;
  }, [userRole, currentContent]);

  // 다음 페이지/컨텐츠로 이동
  const handleNext = useCallback(() => {
    if (!currentPage) return;

    if (currentContentIndex < currentPage.contents.length - 1) {
      setCurrentContentIndex((prev) => prev + 1);
    } else if (currentIndex < storyData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentContentIndex(0);
    }
  }, [currentIndex, currentContentIndex, currentPage, setCurrentIndex]);

  // 오디오 URL 계산
  const currentAudioUrl = useMemo(() => {
    if (!currentContent?.audioId) return '';
    return getAudioUrl(currentContent.audioId);
  }, [currentContent]);

  // 홈 이동 처리
  const handleHomeClick = useCallback(() => {
    window.location.href = '/home';
  }, []);

  // 오디오 재생 완료 처리
  const handleAudioComplete = useCallback(() => {
    if (currentIndex === storyData.length - 1
        && currentContentIndex === currentPage.contents.length - 1) {
      setIsLastAudioCompleted(true);
    } else {
      handleNext();
    }
  }, [currentIndex, currentContentIndex, currentPage?.contents.length, handleNext]);

  // 스토리 종료 여부 확인
  const isStoryEnd = useMemo(() => {
    if (!currentPage || currentIndex !== storyData.length - 1) return false;
    if (currentContentIndex !== currentPage.contents.length - 1) return false;

    const isLastContentNarration = currentContent?.type === 'narration' && currentContent?.audioId;

    return isLastContentNarration ? isLastAudioCompleted : true;
  }, [currentIndex, currentContentIndex, currentPage, currentContent, isLastAudioCompleted]);

  // const [isRecording, setIsRecording] = useState(false);

  // // 녹음 상태 변경 핸들러
  // const handleRecordingStateChange = useCallback((recording: boolean) => {
  //   setIsRecording(recording);
  // }, []);

  // 오디오 재생 여부 결정
  const shouldPlayAudio = useMemo(
    () => !isUserTurn && audioEnabled && currentAudioUrl,
    [isUserTurn, audioEnabled, currentAudioUrl],
  );

  return (
    <div className="w-full h-screen relative">
      {/* 동화 컨텐츠 영역 */}
      <div className="w-full h-full px-6 pb-48 pt-6">
        <div className="mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">함께 읽는 신데렐라</h2>
            <p className="text-gray-600">
              내 역할:
              {' '}
              {userRole === 'prince' ? '왕자님' : '신데렐라'}
            </p>
            <p className="text-gray-600">
              함께 읽는 친구:
              {' '}
              {friend?.name || ''}
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

        {/* 오디오 플레이어 */}
        {shouldPlayAudio && (
          <div className="hidden">
            <AudioPlayer
              ref={audioRef}
              audioFiles={[currentAudioUrl]}
              autoPlay
              onEnded={handleAudioComplete}
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
          onRecordingComplete={() => {
            // 녹음 완료 후 수행할 로직 추가
            // 예: 다음 페이지로 이동, 상태 업데이트 등
            console.log('녹음 완료');
            // 예시: goToNextPage();
          }}
        />
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
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600
                       transition-colors text-lg font-medium"
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
