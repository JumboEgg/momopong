// TogetherMode.tsx
import {
  useState, useEffect, useCallback, useMemo, useRef,
} from 'react';
import { useStory } from '@/stores/storyStore';
import { useMultiplayStore } from '@/stores/multiplayStore';
import storyData from '../data/cinderella';
import StoryIllustration from '../StoryMode/StoryIllustration';
import { StoryEndOverlay } from './StoryEndOverlay';
import { LiveKitProvider } from './LiveKitProvider';
import VideoLayout from './VideoLayout';
import AudioPlayer from '../StoryMode/AudioPlayer';
import { getAudioUrl } from '../utils/audioUtils';

interface TogetherModeProps {
  token: string;
  serverUrl: string;
}

function TogetherMode({ token, serverUrl }: TogetherModeProps): JSX.Element {
  const { currentIndex, setCurrentIndex } = useStory();
  const {
    userRole,
    currentContentIndex,
    setCurrentContentIndex,
  } = useMultiplayStore();

  const [isLastAudioCompleted, setIsLastAudioCompleted] = useState(false);
  const currentPage = storyData[currentIndex];

  // useStory 훅을 통해 직접 상태 가져오기
  const { livekitToken, livekitServerUrl, mode } = useStory();

  // 모드가 'together'가 아니면 기본 페이지 반환
  if (mode !== 'together') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            함께 읽기 모드가 아닙니다.
          </h3>
        </div>
      </div>
    );
  }
  // 토큰이나 서버 URL이 없으면 오류 표시
  if (!livekitToken || !livekitServerUrl) {
    return (
      <div className="error-container">
        <h2>LiveKit 연결 오류</h2>
        <p>토큰 또는 서버 URL이 누락되었습니다.</p>
        <pre>
          Token:
          {livekitToken}
          Server URL:
          {livekitServerUrl}
        </pre>
      </div>
    );
  }

  const characterRole = useMemo(() => {
    if (userRole === 'prince' || userRole === 'princess') {
      return userRole;
    }
    return undefined;
  }, [userRole]);

  const handleNext = useCallback(() => {
    if (!currentPage) return;

    if (currentContentIndex < currentPage.contents.length - 1) {
      setCurrentContentIndex((prev) => prev + 1);
    } else if (currentIndex < storyData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentContentIndex(0);
    }
  }, [currentIndex, currentContentIndex, currentPage, setCurrentIndex, setCurrentContentIndex]);

  const currentContent = currentPage?.contents[currentContentIndex];

  const isStoryEnd = useMemo(() => {
    if (!currentPage || currentIndex !== storyData.length - 1) return false;
    if (currentContentIndex !== currentPage.contents.length - 1) return false;

    const isLastContentNarration = currentContent?.type === 'narration'
      && currentContent?.audioId;

    if (!isLastContentNarration) return true;

    return isLastAudioCompleted;
  }, [currentIndex, currentContentIndex, currentPage, currentContent, isLastAudioCompleted]);

  useEffect(() => {
    setIsLastAudioCompleted(false);
    console.log('Current Page:', currentPage);
    console.log('Current Content:', currentContent);

    // LiveKit 연결 상태 로깅
    console.log('LiveKit Config:', { token, serverUrl });
  }, [currentIndex, currentContentIndex, token, serverUrl]);

  // 명시적으로 토큰과 서버 URL 로깅
  console.log('실제 LiveKit 설정', {
    token: livekitToken,
    serverUrl: livekitServerUrl,
  });

  // 오디오 처리를 위한 새로운 상태 및 ref 추가
  const audioPlayerRef = useRef<HTMLAudioElement>(null);

  // 현재 컨텐츠의 오디오 URL 계산
  const currentAudioUrl = useMemo(() => {
    if (!currentContent?.audioId) return '';
    return getAudioUrl(currentContent.audioId);
  }, [currentContent]);

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
            onClick={() => { window.location.href = '/home'; }}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600
transition-colors duration-200 text-lg font-medium"
          >
            홈으로 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <LiveKitProvider token={livekitToken} serverUrl={livekitServerUrl}>
      <div className="w-[1600px] h-[1000px] mx-auto p-6 relative">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">함께 읽는 신데렐라</h2>
            <p className="text-gray-600">
              내 역할:
              {characterRole === 'prince' ? '왕자님' : '신데렐라'}
            </p>
          </div>
        </div>

        {/* AudioPlayer 추가 */}
        {currentAudioUrl && (
          <div className="hidden">
            <AudioPlayer
              ref={audioPlayerRef}
              audioFiles={[currentAudioUrl]}
              autoPlay
              onEnded={handleNext} // 오디오 재생 완료 시 다음 페이지로 이동
            />
          </div>
        )}

        <StoryIllustration
          pageNumber={currentPage.pageNumber}
          currentContentIndex={currentContentIndex}
          onPrevious={() => {
            if (currentIndex > 0) {
              setCurrentIndex(currentIndex - 1);
              setCurrentContentIndex(0);
            }
          }}
          onNext={handleNext}
          isFirst={currentIndex === 0}
          isLast={isStoryEnd}
          userRole={characterRole}
          currentContent={currentContent}
          illustration={currentPage.illustration}
        />

        <VideoLayout
          userRole={characterRole}
          token={token}
          serverUrl={serverUrl}
        />

        {isStoryEnd && <StoryEndOverlay />}
      </div>
    </LiveKitProvider>
  );
}

export default TogetherMode;
