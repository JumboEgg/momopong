// 수정한거임
import { useStory } from '@/stores/storyStore';
import {
  useEffect,
  useRef,
  useCallback,
  useState,
  ForwardedRef,
  forwardRef,
  SyntheticEvent,
} from 'react';

interface AudioPlayerProps {
  audioFiles: string[];
  autoPlay: boolean;
  onEnded: () => void;
  onError?: () => void;
}

function AudioPlayerComponent(
  {
    audioFiles,
    autoPlay = true,
    onEnded,
    onError,
  }: AudioPlayerProps,
  ref: ForwardedRef<HTMLAudioElement>,
) {
  const { audioEnabled } = useStory();
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const playAttemptRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const filesRef = useRef<string[]>(audioFiles);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // audioFiles가 변경되면 재생 상태 초기화
  useEffect(() => {
    if (JSON.stringify(filesRef.current) !== JSON.stringify(audioFiles)) {
      setCurrentFileIndex(0);
      filesRef.current = audioFiles;
      retryCountRef.current = 0;

      // 현재 재생 중인 오디오 정지
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

  // 오디오 재생 처리 함수
  const handlePlay = useCallback(() => {
    if (!audioRef.current || !audioEnabled) return;

    audioRef.current.volume = 1;
    // 자동 재생이 활성화된 경우
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

  // 오디오 재생 완료 처리
  const handleAudioEnd = useCallback(() => {
    if (currentFileIndex < audioFiles.length - 1) {
      // 다음 파일이 있으면 다음 파일 재생
      setCurrentFileIndex((prev) => prev + 1);
      retryCountRef.current = 0; // Reset retry count for next file
    } else {
      // 마지막 파일이면 정리 후 완료 콜백 호출
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      onEnded();
    }
  }, [currentFileIndex, audioFiles.length, onEnded]);

   // 재생 재시도 함수
  const retryPlayback = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.load();

    // 디버깅용 로그 추가
    console.log('Attempting to play:', audioFiles[currentFileIndex]);

    audioRef.current.play()
      .then(() => {
        console.log('Playback successful');
      })
      .catch((error) => {
        console.error('Detailed Playback Error:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });
      });
  }, [audioFiles, currentFileIndex]);

  // 오디오 에러 처리
  const handleError = useCallback((event: SyntheticEvent<HTMLAudioElement, Event>) => {
    console.error('Audio error:', event);

    if (retryCountRef.current < maxRetries) {
      retryCountRef.current += 1;
      console.log(`Retrying playback attempt ${retryCountRef.current} of ${maxRetries}`);
      retryPlayback();
    } else {
      // 명시적으로 onAudioError prop 호출
      if (onError) {
        onError();
      }

      console.log('Max retries reached, moving to next file');
      retryCountRef.current = 0;
      handleAudioEnd();
    }
  }, [handleAudioEnd, retryPlayback, onError]);
  // 오디오 재생 관리
  useEffect(() => {
    handlePlay();

    return () => {
      // 재생 시도 타이머가 있다면 제거
      if (playAttemptRef.current) {
        clearTimeout(playAttemptRef.current);
      }
      // 재생 중인 오디오가 있다면 정지 및 초기화
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
