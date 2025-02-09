import { StoryMode } from '@/components/stories/types/story';
import ReadingMode from './StoryMode/ReadingMode';
import TogetherMode from './TogetherMode/TogetherMode';

// 스토리 컨테이너 컴포넌트의 프로퍼티 인터페이스
interface StoryContainerProps {
  mode: StoryMode;
}

function StoryContainer({ mode }: StoryContainerProps) {
  return (
    <div className="container mx-auto py-8">
      {mode === 'reading' ? <ReadingMode /> : <TogetherMode />}
    </div>
  );
}

StoryContainer.displayName = 'StoryContainer';

export default StoryContainer;
