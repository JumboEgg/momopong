import { useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStory } from '../contexts/StoryContext';
import storyData from '../data/cinderella';
import AudioPlayer from '../AudioPlayer';
import getAudioPath from '../utils/audioHelper';

function ReadingMode(): JSX.Element {
  const navigate = useNavigate();
  const {
    currentIndex,
    setCurrentIndex,
    audioEnabled, // 오디오 활성화 여부
    toggleAudio,
  } = useStory();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);

  // 현재 재생중인 오디오 정지
  const stopCurrentAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  // 다음 페이지 이동
  const handleNext = useCallback(() => {
    if (currentIndex < storyData.length - 1) {
      stopCurrentAudio();
      setCurrentIndex(currentIndex + 1);
      setCurrentContentIndex(0);
    }
  }, [currentIndex, stopCurrentAudio, setCurrentIndex]);

  // 이전 페이지 이동
  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      stopCurrentAudio();
      setCurrentIndex(currentIndex - 1);
      setCurrentContentIndex(0);
    }
  }, [currentIndex, stopCurrentAudio, setCurrentIndex]);

  // 콘텐츠 종료 처리
  const handleContentEnd = useCallback(() => {
    const currentPage = storyData[currentIndex];
    if (currentContentIndex < currentPage.contents.length - 1) {
      // 다음 컨텐츠로 이동
      setCurrentContentIndex((prev) => prev + 1);
    } else {
      // 다음 페이지로 이동
      handleNext();
    }
  }, [currentIndex, currentContentIndex, handleNext]);

  const currentPage = storyData[currentIndex];
  const currentContent = currentPage.contents[currentContentIndex];

  // Prepare audio files with paths
  const currentAudioFiles = currentContent.audioFiles
    ? currentContent.audioFiles.map((fileName: string) => getAudioPath(fileName))
    : [];

  // 동화 재시작 핸들러
  const handleRestart = useCallback(() => {
    stopCurrentAudio();
    setCurrentIndex(0);
    setCurrentContentIndex(0);
  }, [stopCurrentAudio]);

  // 홈으로 이동 핸들러
  const handleGoHome = useCallback(() => {
    stopCurrentAudio();
    navigate('/home');
  }, [navigate, stopCurrentAudio]);

  const isStoryEnd = currentIndex === storyData.length - 1 && (
    // 음성 모드가 꺼져있을 때는 바로 마지막 페이지에서 종료
    !audioEnabled
    // 음성 모드가 켜져있을 때는 마지막 오디오까지 재생 후 종료
    || (audioEnabled && currentContentIndex === currentPage.contents.length - 1)
  );

  return (
    <div className="max-w-2xl mx-auto p-6 relative min-h-screen">
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

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        {currentPage.contents.map((content, idx) => (
          <div
            key={`${currentPage.pageNumber}-${content.type}-${content.text.substring(0, 20)}`}
            className={`mb-4 last:mb-0 ${
              !audioEnabled || (audioEnabled && idx === currentContentIndex)
                ? 'block'
                : 'hidden'
            }`}
          >
            {content.type !== 'narration' && (
              <div className="text-sm font-medium text-gray-500 mb-1">
                {content.type === 'princess' ? '신데렐라' : '왕자'}
              </div>
            )}
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
              {content.text}
            </p>
          </div>
        ))}

        {audioEnabled && currentAudioFiles.length > 0 && (
          <AudioPlayer
            ref={audioRef}
            audioFiles={currentAudioFiles}
            autoPlay
            onEnded={handleContentEnd}
          />
        )}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          이전
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={isStoryEnd}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          다음
        </button>
      </div>

      {/* 이야기 종료시 나타날 오버레이 */}
      {isStoryEnd && (
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
