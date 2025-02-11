import { useRef, useMemo } from 'react';
import { useMultiplayStore } from '@/stores/multiplayStore';
import { useStory } from '@/stores/storyStore';
import { StoryPageContent } from '../data/cinderella';
import RecordingButton from './RecordingButton';
import AudioPlayer from '../StoryMode/AudioPlayer';
import { getAudioUrl } from '../utils/audioUtils';

// 마이크, 오디오 제어 컨트롤러
interface AudioControllerProps {
  isUserTurn: boolean;
  currentContent: StoryPageContent;
  onComplete: () => void;
}

function AudioController({
  isUserTurn,
  currentContent,
  onComplete,
}: AudioControllerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { audioEnabled, currentIndex } = useStory();
  const { room } = useMultiplayStore();

  // 현재 컨텐츠의 오디오 URL 계산
  const currentAudioUrl = useMemo(() => {
    if (!currentContent || !currentContent.audioId) {
      console.log('No content or audio id found');
      return '';
    }
    return getAudioUrl(currentContent.audioId);
  }, [currentContent]);

  // LiveKit room을 통한 오디오 상태 공유 (필요한 경우)
  const handleAudioStateChange = (state: string) => {
    if (room) {
      const encoder = new TextEncoder();
      const data = encoder.encode(JSON.stringify({
        type: 'AUDIO_STATE',
        state,
      }));
      room.localParticipant.publishData(data, { reliable: true });
    }
  };

  return (
    <div className="mt-4 flex justify-center">
      {isUserTurn ? (
        // 사용자 차례: 녹음 버튼 표시
        <RecordingButton
          characterType={currentContent.type}
          storyIndex={currentIndex}
          onRecordingComplete={() => {
            handleAudioStateChange('completed');
            onComplete();
          }}
        />
      ) : (
        // 상대방 차례: 오디오 재생
        audioEnabled && currentAudioUrl && (
          <div className="hidden">
            <AudioPlayer
              ref={audioRef}
              audioFiles={[currentAudioUrl]}
              autoPlay
              onEnded={() => {
                handleAudioStateChange('ended');
                onComplete();
              }}
            />
          </div>
        )
      )}
    </div>
  );
}

export default AudioController;
