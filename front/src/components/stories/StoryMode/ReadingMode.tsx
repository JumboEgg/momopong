import { useRef, useCallback } from 'react';
import { useStory } from '@/components/stories/contexts/StoryContext';
import storyData from '../data/cinderella';
import AudioPlayer from '../AudioPlayer';
import getAudioPath from '../utils/audioHelper';

function ReadingMode(): JSX.Element {
  const {
    currentIndex, setCurrentIndex, audioEnabled, toggleAudio,
  } = useStory();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopCurrentAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < storyData.length - 1) {
      stopCurrentAudio();
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, stopCurrentAudio, setCurrentIndex]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      stopCurrentAudio();
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex, stopCurrentAudio, setCurrentIndex]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">신데렐라</h2>
        <button
          type="button"
          onClick={toggleAudio}
          className={`px-4 py-2 rounded ${audioEnabled ? 'bg-green-500' : 'bg-gray-500'} text-white`}
        >
          음성
          {' '}
          {audioEnabled ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6 min-h-[200px]">
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          {storyData[currentIndex].text}
        </p>

        {audioEnabled && (
          <AudioPlayer
            ref={audioRef}
            audioUrl={getAudioPath(currentIndex)}
            autoPlay
            onEnded={handleNext}
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
          disabled={currentIndex === storyData.length - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default ReadingMode;
