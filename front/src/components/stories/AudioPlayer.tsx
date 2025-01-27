import React, {
  useEffect,
  forwardRef,
  useRef,
  useCallback,
} from 'react';

import { useStory } from '@/components/stories/contexts/StoryContext';

interface AudioPlayerProps {
  audioUrl: string;
  autoPlay: boolean;
  onEnded: () => void;
}

const AudioPlayer = forwardRef<HTMLAudioElement, AudioPlayerProps>(
  ({ audioUrl, autoPlay = true, onEnded }, ref) => {
    const { audioEnabled } = useStory();
    const playAttemptRef = useRef<NodeJS.Timeout>();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handlePlay = useCallback(() => {
      if (!audioRef.current) return;

      audioRef.current.volume = audioEnabled ? 1 : 0;

      if (autoPlay && audioEnabled) {
        // Cancel previous play attempt
        if (playAttemptRef.current) {
          clearTimeout(playAttemptRef.current);
        }

        // Attempt to play with a slight delay
        playAttemptRef.current = setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch((error) => {
              if (error.name !== 'AbortError') {
                // console.error('Autoplay failed:', error);
              }
            });
          }
        }, 100);
      }
    }, [audioEnabled, autoPlay]);

    useEffect(() => {
      // Combine refs
      if (typeof ref === 'function') {
        ref(audioRef.current);
      } else if (ref) {
        // eslint-disable-next-line no-param-reassign
        ref.current = audioRef.current;
      }

      handlePlay();

      // Cleanup function
      return () => {
        if (playAttemptRef.current) {
          clearTimeout(playAttemptRef.current);
        }

        const audio = audioRef.current;
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      };
    }, [audioUrl, audioEnabled, autoPlay, ref, handlePlay]);

    const handleError = useCallback((event: React.SyntheticEvent<HTMLAudioElement, Event>) => {
      console.error('Audio error:', event);
    }, []);

    return (
      <div className="mt-4">
        <audio
          ref={audioRef}
          src={audioUrl}
          controls
          className="w-full"
          onEnded={onEnded}
          onError={handleError}
        >
          <track kind="captions" src="" />
          <p>Your browser does not support HTML5 audio.</p>
        </audio>
      </div>
    );
  },
);

AudioPlayer.displayName = 'AudioPlayer';

export default AudioPlayer;
