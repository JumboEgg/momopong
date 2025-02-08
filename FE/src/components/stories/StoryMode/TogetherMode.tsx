import {
  useState, useEffect, useRef, useCallback, useMemo,
} from 'react';
import { useFriends } from '@/stores/friendStore';
import { useStory } from '@/stores/storyStore';
import storyData from '../data/cinderella';
import RecordingButton from './RecordingButton';
import AudioPlayer from '../AudioPlayer';
import { getAudioUrl } from '../utils/audioUtils';
import StoryIllustration from './StoryIllustration';

function TogetherMode(): JSX.Element {
  const {
    currentIndex, setCurrentIndex, recordings, audioEnabled,
  } = useStory();

  const {
    friend,
  } = useFriends();

  const [userRole, setUserRole] = useState<'prince' | 'princess' | null>(null);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [isLastAudioCompleted, setIsLastAudioCompleted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentPage = storyData[currentIndex];

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
      console.log('No content or audio id found');
      return '';
    }

    return getAudioUrl(currentContent.audioId);
  }, [currentContent]);

  useEffect(() => {
    const randomRole = Math.random() < 0.5 ? 'prince' : 'princess';
    setUserRole(randomRole);

    // 디버깅 로그 추가
    console.log('Randomly Selected Role:', randomRole);
  }, []);

  useEffect(() => {
    setIsLastAudioCompleted(false);
    console.log('Current Page:', currentPage);
    console.log('Current Content:', currentContent);
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

  if (isStoryEnd) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            함께했던 스토리는 나의집에서 다시볼수있어!
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            다음에 또만나자~
          </p>
          <button
            type="button"
            onClick={handleHomeClick}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-lg font-medium"
          >
            홈으로 가기
          </button>
        </div>
      </div>
    );
  }

  if (!currentContent) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            콘텐츠를 찾을 수 없습니다
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[1600px] h-[1000px] mx-auto p-6 relative">
      <div className="mb-6 flex justify-between items-center">
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

      {/* 이야기 종료시 나타날 오버레이 */}
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
