import DrawingSelection from '@/components/drawing/modeSelection/DrawingTemplateSelection';
import DrawingModeSelection from '@/components/drawing/modeSelection/DrawingModeSelection';
import { useEffect, useState } from 'react';
import DrawingPage from '@/components/drawing/drawingMode/DrawingPage';
import ResultPage from '@/components/drawing/drawingMode/ResultPage';
import FriendSelection from '@/components/stories/StoryMode/FriendSelection';
import { FriendProvider } from '@/components/stories/contexts/FriendContext';
import StoryDrawingPage from '@/components/drawing/storyMode/StroyDrawingPage';
import { useDrawing } from '@/stores/drawingStore';
// import useSocketStore from '@/components/drawing/hooks/useSocketStore';

function Drawing() {
  const {
    mode, setMode, template, setTemplate, setPenColor, setIsErasing, imageData, setImageData,
  } = useDrawing();

  useEffect(() => {
    setMode(null);
    setTemplate(null);
    setPenColor('black');
    setIsErasing(false);
    setImageData('');
  }, []);

  // const {
  //   setConnect,
  // } = useSocketStore();

  const [selectedFriendId, setSelectedFriendId] = useState<string>();

  // useEffect(() => {
  //   setIsConnected(false);
  // }, [mode]);

  const content = () => {
    if (!template) {
      return <DrawingSelection />;
    }

    if (!mode) {
      return <DrawingModeSelection />;
    }

    if (mode === 'together' && !selectedFriendId) {
      return (
        <FriendSelection onFriendSelect={setSelectedFriendId} />
      );
    }

    if (mode === 'story' && !imageData) {
      return <StoryDrawingPage />;
    }

    if (!imageData) {
      return (
        <DrawingPage />
      );
    }

    return <ResultPage />;
  };

  return (
    <FriendProvider>
      {content()}
    </FriendProvider>
  );
}
export default Drawing;
