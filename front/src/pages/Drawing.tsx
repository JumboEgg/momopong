import { DrawingProvider } from '@/components/drawing/contexts/DrawingContext';
import DrawingSelection from '@/components/drawing/modeSelection/DrawingTemplateSelection';
import { DrawingMode } from '@/components/drawing/types/drawing';
import DrawingModeSelection from '@/components/drawing/modeSelection/DrawingModeSelection';
import { useState } from 'react';
import DrawingPage from '@/components/drawing/drawingMode/DrawingPage';
import ResultPage from '@/components/drawing/drawingMode/ResultPage';
import FriendSelection from '@/components/stories/StoryMode/FriendSelection';
import { FriendProvider } from '@/components/stories/contexts/FriendContext';
import StoryDrawingPage from '@/components/drawing/storyMode/StroyDrawingPage';

function Drawing() {
  const [selectedDrawing, setSelectedDrawing] = useState<number | null>(null);
  const [selectedMode, setSelectedMode] = useState<DrawingMode | null>(null);
  const [resultSrc, setResultSrc] = useState<string | null>(null);
  const [selectedFriendId, setSelectedFriendId] = useState<string>();

  const handleDrawingSelect = (templateId: number) => {
    setSelectedDrawing(templateId);
  };

  const handleModeSelect = (mode: DrawingMode) => {
    setSelectedMode(mode);
  };

  const content = () => {
    if (!selectedDrawing) {
      return <DrawingSelection onDrawingSelect={handleDrawingSelect} />;
    }

    if (!selectedMode) {
      return (
        <DrawingModeSelection
          onModeSelect={handleModeSelect}
          onBack={() => setSelectedDrawing(null)}
        />
      );
    }

    if (selectedMode === 'together' && !selectedFriendId) {
      return (
        <FriendSelection
          onFriendSelect={setSelectedFriendId}
          onBack={() => setSelectedMode(null)}
        />
      );
    }

    if (selectedMode === 'story' && !resultSrc) {
      return <StoryDrawingPage onDrawingResult={setResultSrc} />;
    }

    if (!resultSrc) {
      return (
        <DrawingPage onDrawingResult={setResultSrc} />
      );
    }

    return <ResultPage />;
  };

  return (
    <DrawingProvider>
      <FriendProvider>
        {content()}
      </FriendProvider>
    </DrawingProvider>
  );
}
export default Drawing;
