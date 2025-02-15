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

/**
 * 🎵 오디오 플레이어 컴포넌트
 * - 오디오 파일 목록을 받아 재생
 * - 자동 재생 (`autoPlay`) 지원
 * - 재생 중 오류 발생 시 최대 3회까지 자동 재시도
 */
interface AudioPlayerProps {
  audioFiles: string[]; // 🎵 재생할 오디오 파일 목록
  autoPlay: boolean; // 🔄 자동 재생 여부
  onEnded: () => void; // ⏭️ 오디오 재생이 끝났을 때 호출할 함수
  onError?: () => void; // ❌ 재생 오류 발생 시 호출할 함수 (선택적)
}

/**
 * 🎵 `AudioPlayerComponent`
 * - HTML `<audio>` 요소를 활용하여 오디오를 재생
 * - 부모 컴포넌트에서 `ref`를 통해 직접 컨트롤 가능
 */
function AudioPlayerComponent(
  {
    audioFiles,
    autoPlay = true,
    onEnded,
    onError,
  }: AudioPlayerProps,
  ref: ForwardedRef<HTMLAudioElement>,
) {
  const { audioEnabled } = useStory(); // 🔊 오디오 활성화 여부 (`useStory`에서 가져옴)
  const [currentFileIndex, setCurrentFileIndex] = useState(0); // 📂 현재 재생 중인 오디오 파일 인덱스
  const playAttemptRef = useRef<NodeJS.Timeout>(); // ⏳ 자동 재생 타이머
  const audioRef = useRef<HTMLAudioElement | null>(null); // 🎵 오디오 엘리먼트 참조
  const filesRef = useRef<string[]>(audioFiles); // 🎵 현재 오디오 파일 목록 참조
  const retryCountRef = useRef(0); // 🔁 재생 오류 발생 시 재시도 횟수
  const maxRetries = 3; // 🔁 최대 재시도 횟수

  /**
   * 🆕 `audioFiles` 변경 감지
   * - 새로운 파일이 설정되면 `currentFileIndex`를 0으로 리셋
   * - 기존 오디오를 정지하고 초기화
   */
  useEffect(() => {
    if (JSON.stringify(filesRef.current) !== JSON.stringify(audioFiles)) {
      setCurrentFileIndex(0);
      filesRef.current = audioFiles;
      retryCountRef.current = 0;

      // 현재 오디오 정리
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [audioFiles]);

  /**
   * 🔄 `ref` 동기화 (부모 컴포넌트에서 `<audio>` 요소 접근 가능)
   */
  useEffect(() => {
    if (!audioRef.current) return () => {};

    if (typeof ref === 'function') {
      ref(audioRef.current);
    } else if (ref) {
      ref.current = audioRef.current;
    }

    return () => {
      if (typeof ref === 'function') {
        ref(null);
      } else if (ref) {
        ref.current = null;
      }
    };
  }, [ref]);

  /**
   * ▶️ 오디오 자동 재생 핸들러
   * - `autoPlay`가 활성화된 경우 자동 재생 시도
   */
  const handlePlay = useCallback(() => {
    if (!audioRef.current || !audioEnabled) return;

    audioRef.current.volume = 1; // 🔊 볼륨 설정

    if (autoPlay) {
      if (playAttemptRef.current) {
        clearTimeout(playAttemptRef.current);
      }

      playAttemptRef.current = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch((error) => {
            if (error.name !== 'AbortError') {
              console.error('❌ 자동 재생 실패:', error);
            }
          });
        }
      }, 100);
    }
  }, [audioEnabled, autoPlay]);

  /**
   * ⏭️ 오디오 종료 이벤트 핸들러
   * - 현재 파일이 끝나면 다음 파일로 넘어감
   * - 모든 파일이 끝나면 `onEnded()` 호출
   */
  const handleAudioEnd = useCallback(() => {
    if (currentFileIndex < audioFiles.length - 1) {
      setCurrentFileIndex((prev) => prev + 1);
      retryCountRef.current = 0; // 재시도 횟수 초기화
    } else {
      // 모든 파일이 끝났을 경우, 종료 처리
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      onEnded();
    }
  }, [currentFileIndex, audioFiles.length, onEnded]);

  /**
   * 🔁 오디오 재생 오류 발생 시 자동 재시도
   */
  const retryPlayback = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.load();

    // 🔍 디버깅 로그 추가
    console.log('🔄 오디오 재생 시도:', audioFiles[currentFileIndex]);

    audioRef.current.play()
      .then(() => {
        console.log('✅ 오디오 재생 성공');
      })
      .catch((error) => {
        console.error('❌ 오디오 재생 오류:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });
      });
  }, [audioFiles, currentFileIndex]);

  /**
   * ❌ 오디오 재생 오류 핸들러
   * - 최대 `maxRetries`까지 재시도 후 다음 파일로 이동
   */
  const handleError = useCallback((event: SyntheticEvent<HTMLAudioElement, Event>) => {
    console.error('🚨 오디오 재생 오류:', event);

    if (retryCountRef.current < maxRetries) {
      retryCountRef.current += 1;
      console.log(`🔁 재생 재시도 (${retryCountRef.current} / ${maxRetries})`);
      retryPlayback();
    } else {
      // 최대 재시도 횟수를 초과하면 `onError()` 호출 후 다음 파일로 이동
      if (onError) {
        onError();
      }

      console.log('❌ 최대 재시도 도달, 다음 파일로 이동');
      retryCountRef.current = 0;
      handleAudioEnd();
    }
  }, [handleAudioEnd, retryPlayback, onError]);

  /**
   * 🎵 오디오 재생 시작 (마운트 시 실행)
   */
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

  // 🎵 재생할 오디오 파일이 없으면 렌더링하지 않음
  if (!audioFiles.length) return null;

  return (
    <div className="mt-4">
      <audio
        ref={audioRef}
        src={audioFiles[currentFileIndex]}
        className="w-full"
        onEnded={handleAudioEnd} // ⏭️ 재생 종료 시 이벤트 핸들러
        onError={handleError} // ❌ 재생 오류 이벤트 핸들러
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
