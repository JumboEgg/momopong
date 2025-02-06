import {
  useEffect, useRef, useCallback, useState,
  ForwardedRef, forwardRef, SyntheticEvent,
} from 'react';

import { useStory } from '@/components/stories/contexts/StoryContext';

interface AudioPlayerProps {
  audioFiles: string[];
  autoPlay: boolean;
  onEnded: () => void;
}

function AudioPlayerComponent(
  { audioFiles, autoPlay = true, onEnded }: AudioPlayerProps,
  ref: ForwardedRef<HTMLAudioElement>,
) {
  const { audioEnabled } = useStory();
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const playAttemptRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const filesRef = useRef<string[]>(audioFiles);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // Reset currentFileIndex when audioFiles change
  useEffect(() => {
    if (JSON.stringify(filesRef.current) !== JSON.stringify(audioFiles)) {
      setCurrentFileIndex(0);
      filesRef.current = audioFiles;
      retryCountRef.current = 0;

      // Ensure cleanup of current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [audioFiles]);

  // ref synchronization
  useEffect(() => {
    if (!audioRef.current) return () => {};

    if (typeof ref === 'function') {
      ref(audioRef.current);
    } else if (ref) {
      // eslint-disable-next-line no-param-reassign
      ref.current = audioRef.current;
    }

    return () => {
      if (typeof ref === 'function') {
        ref(null);
      } else if (ref) {
        // eslint-disable-next-line no-param-reassign
        ref.current = null;
      }
    };
  }, [ref]);

  const handlePlay = useCallback(() => {
    if (!audioRef.current || !audioEnabled) return;

    audioRef.current.volume = 1;

    if (autoPlay) {
      if (playAttemptRef.current) {
        clearTimeout(playAttemptRef.current);
      }

      playAttemptRef.current = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch((error) => {
            if (error.name !== 'AbortError') {
              console.error('Autoplay failed:', error);
            }
          });
        }
      }, 100);
    }
  }, [audioEnabled, autoPlay]);

  const handleAudioEnd = useCallback(() => {
    if (currentFileIndex < audioFiles.length - 1) {
      setCurrentFileIndex((prev) => prev + 1);
      retryCountRef.current = 0; // Reset retry count for next file
    } else {
      // Ensure cleanup before calling onEnded
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      onEnded();
    }
  }, [currentFileIndex, audioFiles.length, onEnded]);

  const retryPlayback = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.load();
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.error('Retry playback failed:', error);
        });
      }
    }, 1000);
  }, []);

  const handleError = useCallback((event: SyntheticEvent<HTMLAudioElement, Event>) => {
    console.error('Audio error:', event);

    if (retryCountRef.current < maxRetries) {
      retryCountRef.current += 1;
      console.log(`Retrying playback attempt ${retryCountRef.current} of ${maxRetries}`);
      retryPlayback();
    } else {
      // Only move to next file after all retries are exhausted
      console.log('Max retries reached, moving to next file');
      retryCountRef.current = 0;
      handleAudioEnd();
    }
  }, [handleAudioEnd, retryPlayback]);

  useEffect(() => {
    handlePlay();

    return () => {
      if (playAttemptRef.current) {
        clearTimeout(playAttemptRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [audioFiles[currentFileIndex], audioEnabled, autoPlay, handlePlay]);

  // If no audio files are provided, don't render anything
  if (!audioFiles.length) return null;

  return (
    <div className="mt-4">
      <audio
        ref={audioRef}
        src={audioFiles[currentFileIndex]}
        // controls
        className="w-full"
        onEnded={handleAudioEnd}
        onError={handleError}
      >
        <track kind="captions" src="" />
        <p>Your browser does not support HTML5 audio.</p>
      </audio>
    </div>
  );
}

const AudioPlayer = forwardRef(AudioPlayerComponent);

AudioPlayer.displayName = 'AudioPlayer';

export default AudioPlayer;
