import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
}
  from 'react';
import { useStory } from '../contexts/StoryContext';
import storyData from '../data/cinderella';
import RecordingButton from './RecordingButton';
import AudioPlayer from '../AudioPlayer';
import { CharacterType } from '../types/story';
import getAudioPath from '../utils/audioHelper';

function TogetherMode(): JSX.Element {
  const {
    currentIndex, setCurrentIndex, recordings, audioEnabled,
  } = useStory();
  const [userRole, setUserRole] = useState<'hero1' | 'hero2' | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentAudioUrl = useMemo(() => getAudioPath(currentIndex), [currentIndex]);

  useEffect(() => {
    const randomRole = Math.random() < 0.5 ? 'hero1' : 'hero2';
    setUserRole(randomRole);
  }, []);

  const currentLine = storyData[currentIndex];
  const isUserTurn = userRole && currentLine.type === userRole;

  const getCurrentSpeaker = useCallback((type: CharacterType) => {
    if (type === 'narration') return '나레이션';
    if (type === 'hero1') return `주인공1${userRole === 'hero1' ? ' (나)' : ''}`;
    if (type === 'hero2') return `주인공2${userRole === 'hero2' ? ' (나)' : ''}`;
    if (type === 'bigsis1') return '언니1';
    if (type === 'bigsis2') return '언니2';
    return '등장인물';
  }, [userRole]);

  const handleRecordingComplete = useCallback(() => {
    setTimeout(() => {
      if (currentIndex < storyData.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }, 1000);
  }, [currentIndex, setCurrentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < storyData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, setCurrentIndex]);

  const hasRecording = useCallback((index: number) => recordings.has(index), [recordings]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">함께 읽는 신데렐라</h2>
        <p className="text-gray-600 mt-2">
          내 역할:
          {' '}
          {userRole === 'hero1' ? '주인공1' : '주인공2'}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="mb-4 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">
            {getCurrentSpeaker(currentLine.type)}
            의 대사
          </span>
          {hasRecording(currentIndex) && <span className="text-green-500 text-sm">✓ 녹음완료</span>}
        </div>

        <p className="text-lg text-gray-700 leading-relaxed mb-4">{currentLine.text}</p>

        {isUserTurn ? (
          <div className="mt-4">
            {!hasRecording(currentIndex) && (
              <RecordingButton
                characterType={currentLine.type}
                storyIndex={currentIndex}
                onRecordingComplete={handleRecordingComplete}
              />
            )}
          </div>
        ) : (
          audioEnabled && (
            <AudioPlayer
              ref={audioRef}
              audioUrl={currentAudioUrl}
              autoPlay
              onEnded={handleNext}
            />
          )
        )}
      </div>

      {(!isUserTurn || hasRecording(currentIndex)) && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex === storyData.length - 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600 transition-colors"
          >
            다음
          </button>
        </div>
      )}

      {currentIndex === storyData.length - 1 && (
        <div className="mt-6 text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">이야기가 끝났어요!</h3>
          <p className="text-gray-600">멋진 목소리 연기를 들려주어서 고마워요.</p>
        </div>
      )}
    </div>
  );
}

export default TogetherMode;
