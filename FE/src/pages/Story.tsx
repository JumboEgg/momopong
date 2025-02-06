import { useState } from 'react';
import { StoryProvider } from '@/components/stories/contexts/StoryContext';
import ReadingMode from '@/components/stories/StoryMode/ReadingMode';
import TogetherMode from '@/components/stories/StoryMode/TogetherMode';
import StorySelection from '@/components/stories/StoryMode/StorySelection';
import ModeSelection from '@/components/stories/ModeSelection/ModeSelection';
import { StoryMode } from '@/components/stories/types/story';
import { useFriends } from '@/stores/friendStore';
import FriendSelection from '@/components/stories/StoryMode/FriendSelection';

function Story() {
  const {
    friend,
  } = useFriends();

  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<StoryMode | null>(null);

  const handleStorySelect = (storyId: string) => {
    setSelectedStory(storyId);
  };

  const handleModeSelect = (mode: StoryMode) => {
    setSelectedMode(mode);
  };

  const content = () => {
    if (!selectedStory) {
      return <StorySelection onStorySelect={handleStorySelect} />;
    }

    if (!selectedMode) {
      return <ModeSelection onModeSelect={handleModeSelect} />;
    }

    if (selectedMode === 'reading') {
      return <ReadingMode />;
    }

    if (!friend) {
      return <FriendSelection />;
    }

    return <TogetherMode friend={friend} />;
  };

  return (
    <StoryProvider>
      {content()}
    </StoryProvider>
  );
}

export default Story;
