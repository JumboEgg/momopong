import { useState } from 'react';
import { StoryProvider } from '@/components/stories/contexts/StoryContext';
import { FriendProvider } from '@/components/stories/contexts/FriendContext';
import ReadingMode from '@/components/stories/StoryMode/ReadingMode';
import TogetherMode from '@/components/stories/StoryMode/TogetherMode';
import StorySelection from '@/components/stories/StoryMode/StorySelection';
import ModeSelection from '@/components/stories/ModeSelection/ModeSelection';
import { StoryMode } from '@/components/stories/types/story';

function Story() {
  const [selectedStory, setSelectedStory] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<StoryMode | null>(null);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);

  const handleStorySelect = (storyId: string) => {
    setSelectedStory(storyId);
  };

  const handleModeSelect = (mode: StoryMode, friendId?: string) => {
    setSelectedMode(mode);
    if (friendId) {
      setSelectedFriendId(friendId);
    }
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

    if (!selectedFriendId) {
      return <ModeSelection onModeSelect={handleModeSelect} />;
    }

    return <TogetherMode friendId={selectedFriendId} />;
  };

  return (
    <StoryProvider>
      <FriendProvider>
        {content()}
      </FriendProvider>
    </StoryProvider>
  );
}

export default Story;
