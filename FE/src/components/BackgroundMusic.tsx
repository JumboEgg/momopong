import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

function BackgroundMusic(): JSX.Element | null {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const audioPath = '/audio/bgm/background.mp3';
    const audio = new Audio(audioPath);

    // audio 설정
    audio.loop = true;
    audio.volume = 0.3;

    // audioRef에 저장
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    const currentAudio = audioRef.current;
    if (currentAudio) {
      if (isPlaying) {
        currentAudio.pause();
      } else {
        currentAudio.play().catch((error: Error) => {
          console.log('Playback failed:', error.message);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        type="button"
        onClick={togglePlay}
        className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm touch-manipulation"
        aria-label={isPlaying ? '음악 끄기' : '음악 켜기'}
      >
        {isPlaying ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
      </button>
    </div>
  );
}

export default BackgroundMusic;
