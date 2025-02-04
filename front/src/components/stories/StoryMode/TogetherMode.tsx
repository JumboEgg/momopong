import {
  useState, useEffect, useRef, useCallback, useMemo,
} from 'react';
import { useStory } from '../contexts/StoryContext';
import storyData from '../data/cinderella';
import RecordingButton from './RecordingButton';
import AudioPlayer from '../AudioPlayer';
import { CharacterType } from '../types/story';
import getAudioPath from '../utils/audioHelper';
import type { TogetherModeProps } from '../types/story';

function TogetherMode({ friendId }: TogetherModeProps): JSX.Element {
  const {
    currentIndex, setCurrentIndex, recordings, audioEnabled,
  } = useStory();
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

  // Add isStoryEnd condition with safe checks and last audio completion
  const isStoryEnd = useMemo(() => {
    if (!currentPage || currentIndex !== storyData.length - 1) return false;
    if (currentContentIndex !== currentPage.contents.length - 1) return false;

    // 마지막 페이지의 마지막 컨텐츠가 나레이션이고 오디오가 있는 경우
    const isLastContentNarration = currentContent?.type === 'narration'
      && currentContent?.audioFiles?.length > 0;

    // 나레이션이 아니거나 오디오가 없는 경우는 바로 종료
    if (!isLastContentNarration) return true;

    // 나레이션이고 오디오가 있는 경우는 오디오 완료 후 종료
    return isLastAudioCompleted;
  }, [currentIndex, currentContentIndex, currentPage, currentContent, isLastAudioCompleted]);

  const currentAudioFiles = useMemo(() => {
    if (!currentContent || !currentContent.audioFiles) {
      console.log('No content or audio files found');
      return [];
    }

    return currentContent.audioFiles.map((fileName: string) => getAudioPath(fileName));
  }, [currentContent]);

  useEffect(() => {
    const randomRole = Math.random() < 0.5 ? 'prince' : 'princess';
    setUserRole(randomRole);
  }, []);

  // Reset isLastAudioCompleted when content changes
  useEffect(() => {
    setIsLastAudioCompleted(false);
  }, [currentIndex, currentContentIndex]);

  const isUserTurn = useMemo(() => {
    if (!userRole || !currentContent) return false;
    return currentContent.type === userRole;
  }, [userRole, currentContent]);

  const getCurrentSpeaker = useCallback((type: CharacterType) => {
    if (type === 'narration') return '나레이션';
    if (type === 'prince') return `왕자님${userRole === 'prince' ? ' (나)' : ''}`;
    if (type === 'princess') return `신데렐라${userRole === 'princess' ? ' (나)' : ''}`;
    return '등장인물';
  }, [userRole]);

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

  // Show ending screen when story is finished
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
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">함께 읽는 신데렐라</h2>
        <p className="text-gray-600 mt-2">
          내 역할:
          {' '}
          {userRole === 'prince' ? '왕자님' : '신데렐라'}
        </p>
        <p className="text-gray-600">
          함께 읽는 친구:
          {' '}
          {friendId}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="mb-4 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">
            {getCurrentSpeaker(currentContent.type)}
            의 대사
          </span>
          {hasRecording(currentIndex) && <span className="text-green-500 text-sm">✓ 녹음완료</span>}
        </div>

        <p className="text-lg text-gray-700 leading-relaxed mb-4">{currentContent.text}</p>

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
          audioEnabled && (
            <AudioPlayer
              ref={audioRef}
              audioFiles={currentAudioFiles}
              autoPlay
              onEnded={handleAudioComplete}
            />
          )
        )}
      </div>

      {(!isUserTurn || hasRecording(currentIndex)) && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleNext}
            disabled={isStoryEnd}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600 transition-colors"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}

export default TogetherMode;
