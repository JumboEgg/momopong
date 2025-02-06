import {
  useRef,
  useCallback,
  useState,
  ReactElement,
} from 'react';

import { useNavigate } from 'react-router-dom';
import { useStory } from '../contexts/StoryContext';
import storyData from '../data/cinderella';
import AudioPlayer from '../AudioPlayer';
import getAudioPath from '../utils/audioHelper';
import StoryIllustration from './StoryIllustration';

function ReadingMode(): ReactElement {
  const navigate = useNavigate();
  const {
    currentIndex,
    setCurrentIndex,
    audioEnabled,
    toggleAudio,
  } = useStory();

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
    if (!audioEnabled && currentContentIndex < storyData[currentIndex].contents.length - 1) {
      setCurrentContentIndex(currentContentIndex + 1);
    } else if (currentIndex < storyData.length - 1) {
      stopCurrentAudio();
      setCurrentIndex(currentIndex + 1);
      setCurrentContentIndex(0);
    }
  }, [currentIndex, currentContentIndex, audioEnabled, stopCurrentAudio, setCurrentIndex]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      stopCurrentAudio();
      setCurrentIndex(currentIndex - 1);
      setCurrentContentIndex(0);
    }
  }, [currentIndex, stopCurrentAudio, setCurrentIndex]);

  const handleContentEnd = useCallback(() => {
    const isLastPage = currentIndex === storyData.length - 1;
    const isLastContent = currentContentIndex === storyData[currentIndex].contents.length - 1;

    if (isLastPage && isLastContent) {
      setShowEndOverlay(true);
      return;
    }

    if (currentContentIndex < storyData[currentIndex].contents.length - 1) {
      setCurrentContentIndex((prev) => prev + 1);
    } else {
      handleNext();
    }
  }, [currentIndex, currentContentIndex, handleNext, setCurrentIndex]);

  const handleRestart = useCallback(() => {
    stopCurrentAudio();
    setCurrentIndex(0);
    setCurrentContentIndex(0);
    setShowEndOverlay(false);
  }, [stopCurrentAudio, setCurrentIndex]);

  const handleGoHome = useCallback(() => {
    stopCurrentAudio();
    navigate('/home');
  }, [navigate, stopCurrentAudio]);

  const currentPage = storyData[currentIndex];
  const currentContent = currentPage.contents[currentContentIndex];
  const isLastContent = currentIndex === storyData.length - 1
  && currentContentIndex === storyData[currentIndex].contents.length - 1;

  const currentAudioFiles = currentContent.audioFiles
    ? currentContent.audioFiles.map((fileName: string) => getAudioPath(fileName))
    : [];

  return (
    <div className="w-[1600px] h-[1000px] mx-auto p-6 relative">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          신데렐라
          {' '}
          <span className="text-base text-gray-600">
            {currentPage.pageNumber}
            /16
          </span>
        </h2>
        <button
          type="button"
          onClick={toggleAudio}
          className={`px-4 py-2 rounded ${audioEnabled ? 'bg-green-500' : 'bg-gray-500'} text-white`}
        >
          음성
          {' '}
          <span>{audioEnabled ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      <StoryIllustration
        pageNumber={currentPage.pageNumber}
        currentContentIndex={currentContentIndex}
        onPrevious={handlePrevious}
        onNext={handleNext}
        isFirst={currentIndex === 0}
        isLast={isLastContent}
      />

      {audioEnabled && currentAudioFiles.length > 0 && (
        <AudioPlayer
          ref={audioRef}
          audioFiles={currentAudioFiles}
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
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-lg font-medium"
              >
                다시 읽기
              </button>
              <button
                type="button"
                onClick={handleGoHome}
                className="w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-lg font-medium"
              >
                홈으로 가기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReadingMode;
