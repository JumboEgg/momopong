import {
  useRef,
  useCallback,
  useState,
  ReactElement,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useStory } from '@/stores/storyStore';
import { useReadingHistoryContent } from '@/stores/book/readingHistoryContentStore';
import { IconCircleButton, TextCircleButton } from '@/components/common/buttons/CircleButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faVolumeHigh, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import StoryIllustration from './StoryIllustration';
import AudioPlayer from '../AudioPlayer';

function RecordReadingMode(): ReactElement {
  const navigate = useNavigate();
  const {
    currentIndex,
    setCurrentIndex,
    audioEnabled,
    toggleAudio,
  } = useStory();

  const { readingHistoryContent } = useReadingHistoryContent();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [showEndOverlay, setShowEndOverlay] = useState(false);

  const stopCurrentAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const handleNext = useCallback(() => {
    const currentPage = readingHistoryContent?.pages[currentIndex];

    // 현재 페이지에 다음 콘텐츠가 있는 경우
    if (currentContentIndex < (currentPage?.audios.length ?? 0) - 1) {
      setCurrentContentIndex(currentContentIndex + 1);
    } else if (currentIndex < (readingHistoryContent?.pages.length ?? 0) - 1) {
      stopCurrentAudio();
      setCurrentIndex(currentIndex + 1);
      setCurrentContentIndex(0);
    } else {
      setShowEndOverlay(true);
    }
  }, [currentIndex, currentContentIndex, stopCurrentAudio, setCurrentIndex]);

  const handlePrevious = useCallback(() => {
    // 첫 번째 콘텐츠가 아니면 이전 콘텐츠로 이동
    if (currentContentIndex > 0) {
      setCurrentContentIndex(currentContentIndex - 1);
      return;
    }

    // 첫 번째 콘텐츠면 이전 페이지의 마지막 콘텐츠로 이동
    if (currentIndex > 0) {
      stopCurrentAudio();
      setCurrentIndex(currentIndex - 1);
      const prevPage = readingHistoryContent?.pages[currentIndex - 1];
      setCurrentContentIndex((prevPage?.audios.length ?? 0) - 1);
    }
  }, [currentIndex, currentContentIndex, stopCurrentAudio, setCurrentIndex]);

  const handleContentEnd = useCallback(() => {
    const currentPage = readingHistoryContent?.pages[currentIndex];

    // 현재 페이지의 다음 콘텐츠로 이동 또는 다음 페이지로 전환
    const hasNextContent = currentContentIndex < (currentPage?.audios.length ?? 0) - 1;
    const hasNextPage = currentIndex < (readingHistoryContent?.pages.length ?? 0) - 1;

    if (hasNextContent) {
      setCurrentContentIndex(currentContentIndex + 1);
    } else if (hasNextPage) {
      stopCurrentAudio();
      setCurrentIndex(currentIndex + 1);
      setCurrentContentIndex(0);
    } else {
      setShowEndOverlay(true);
    }
  }, [currentIndex, currentContentIndex, stopCurrentAudio, setCurrentIndex]);

  const handleRestart = useCallback(() => {
    stopCurrentAudio();
    setCurrentIndex(0);
    setCurrentContentIndex(0);
    setShowEndOverlay(false);
  }, [stopCurrentAudio, setCurrentIndex]);

  const handleGoHome = useCallback(() => {
    stopCurrentAudio();
    navigate('/house/mybookstory');
  }, [navigate, stopCurrentAudio]);

  const currentPage = readingHistoryContent?.pages[currentIndex];
  const currentContent = currentPage?.audios[currentContentIndex];
  const isLastPage = currentIndex === (readingHistoryContent?.pages.length ?? 0) - 1;

  const audioUrl = currentContent?.path ?? '';

  return (
    <div className="w-[100vw] h-[100vh] mx-auto relative">
      <div className="fixed top-2 left-2 z-20">
        <IconCircleButton
          size="sm"
          variant="action"
          onClick={handleGoHome}
          icon={<FontAwesomeIcon icon={faArrowLeft} size="sm" />}
          className=""
        />
      </div>
      <div className="fixed top-2 right-2 z-20">
        <TextCircleButton
          text={audioEnabled ? '내가 읽기' : '읽어주기'}
          icon={audioEnabled
            ? <FontAwesomeIcon icon={faVolumeHigh} />
            : <FontAwesomeIcon icon={faVolumeMute} />}
          size="sm"
          variant="story"
          onClick={toggleAudio}
        />
      </div>
      <StoryIllustration
        pageNumber={currentPage?.pageNumber ?? 0}
        currentContentIndex={currentContentIndex}
        onPrevious={handlePrevious}
        onNext={handleNext}
        isFirst={currentIndex === 0 && currentContentIndex === 0}
        isLast={isLastPage && currentContentIndex === (currentPage?.audios.length ?? 0) - 1}
        currentContent={currentContent}
        illustration={currentPage?.pagePath ?? ''}
      />

      {audioEnabled && currentContent?.path && (
        <AudioPlayer
          ref={audioRef}
          audioFiles={[audioUrl ?? '']}
          autoPlay
          onEnded={handleContentEnd}
        />
      )}

      {showEndOverlay && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50" />
          <div className="bg-white rounded-lg p-8 shadow-xl max-w-sm w-full mx-4 z-50 relative">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              이야기가 끝났어요!
            </h3>
            <p className="text-gray-600 mb-8 text-center">
              이야기를 즐겁게 읽어주셔서 감사합니다.
            </p>
            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={handleRestart}
                className="w-full py-3 bg-amber-300 text-white rounded-lg hover:bg-amber-400 transition-colors text-lg font-medium"
              >
                다시 읽을래
              </button>
              <button
                type="button"
                onClick={handleGoHome}
                className="w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-lg font-medium"
              >
                돌아갈래
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecordReadingMode;
