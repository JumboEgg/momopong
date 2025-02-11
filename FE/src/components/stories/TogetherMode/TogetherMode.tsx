import { useState } from 'react';
import { LiveKitRoom } from '@livekit/components-react';
import { useMultiplayStore } from '@/stores/multiplayStore';
import { useLiveKitRoom } from './hooks/useLiveKitRoom';
import { useStoryNavigation } from './hooks/useStoryNavigation';
import VideoLayout from './VideoLayout';
import StoryComplete from './StoryComplete';
import AudioPlayer from '../StoryMode/AudioPlayer';
import StoryIllustration from '../StoryMode/StoryIllustration';
import { getAudioUrl } from '../utils/audioUtils';
import { StoryPageContent } from '../types/story';

function TogetherMode() {
  const { userRole } = useMultiplayStore();
  const [participantName] = useState(
    `${userRole || '참가자'}${Math.floor(Math.random() * 100)}`,
  );
  const [roomName] = useState('스토리 룸');

  const {
    currentIndex,
    currentContentIndex,
    currentPage,
    currentContent,
    handleNext,
    handlePrevious,
    isStoryEnd,
    setIsLastAudioCompleted,
  } = useStoryNavigation();

  const { serverUrl, token } = useLiveKitRoom(roomName, participantName);

  const currentAudioUrl = currentContent?.audioId ? getAudioUrl(currentContent.audioId) : '';

  const safeUserRole = userRole || undefined;

  if (isStoryEnd) {
    return <StoryComplete />;
  }

  if (!serverUrl || !token) {
    return <div>Connecting to LiveKit...</div>;
  }

  return (
    <div className="w-full h-full flex flex-col">
      {currentAudioUrl && (
        <AudioPlayer
          audioFiles={[currentAudioUrl]}
          autoPlay
          onEnded={() => {
            setIsLastAudioCompleted(true);
            handleNext();
          }}
        />
      )}

      <StoryIllustration
        pageNumber={currentPage.pageNumber}
        currentContentIndex={currentContentIndex}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isFirst={currentIndex === 0}
        isLast={isStoryEnd}
        userRole={safeUserRole as 'prince' | 'princess' | undefined}
        currentContent={currentContent as StoryPageContent}
        illustration={currentPage.illustration}
      />

      <LiveKitRoom serverUrl={serverUrl} token={token}>
        <VideoLayout userRole={safeUserRole as 'prince' | 'princess' | undefined} />
      </LiveKitRoom>
    </div>
  );
}

export default TogetherMode;
