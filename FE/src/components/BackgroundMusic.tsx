import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

function BackgroundMusic(): React.ReactNode {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
    try {
      const audio = new Audio(`${window.location.origin}/bgm/background.mp3`);

      audio.addEventListener('loadstart', () => {
        console.log('Started loading audio');
      });

      audio.addEventListener('canplaythrough', () => {
        console.log('Audio is loaded and can play');
      });

      audio.addEventListener('error', (e) => {
        console.error('Audio error:', {
          error: e,
          networkState: audio.networkState,
          readyState: audio.readyState,
          src: audio.src,
          supported: audio.canPlayType('audio/mpeg'),
        });
      });

      audioRef.current = audio;
      audio.loop = true;
      audio.volume = 0.3;

      audio.load();
    } catch (error) {
      console.error('Error creating audio:', error);
    }

    const enableAutoplay = () => {
      const currentAudio = audioRef.current;
      if (currentAudio && !isPlaying) {
        currentAudio
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error: Error) => {
            console.log('Autoplay failed:', error.message);
          });
      }
      document.removeEventListener('touchstart', enableAutoplay);
    };

    document.addEventListener('touchstart', enableAutoplay);

    return () => {
      const currentAudio = audioRef.current;
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      document.removeEventListener('touchstart', enableAutoplay);
    };
  }, [isPlaying]);

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
