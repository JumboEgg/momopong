import { useEffect, useRef, useState } from 'react';
import { useDrawing } from '@/stores/drawing/drawingStore';
import { useBookContent } from '@/stores/book/bookContentStore';
import { DrawingParticipationRecordData } from '@/types/sketch';
import useSubAccountStore from '@/stores/subAccountStore';
import { useStory } from '@/stores/storyStore';
import DrawingCanvas from '../canvasComponents/DrawingCanvas';
import Palette from '../canvasComponents/Color';
import SaveButton from '../canvasComponents/SaveButton';
import useSocketStore from '../hooks/useSocketStore';

interface StoryDrawingPageProps {
  roomName: string;
  handleNext: () => void;
}

function StoryDrawingPage({ roomName, handleNext }: StoryDrawingPageProps): JSX.Element {
  const { setSessionId, setTemplate, setMode } = useDrawing();
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const isRecording = useRef(false);
  const { setConnect, setRoomId, isConnected } = useSocketStore();
  const { currentIndex } = useStory();
  const { bookContent } = useBookContent();
  const currentPage = bookContent?.pages[currentIndex];
  const sketchPath = currentPage?.position.sketchPath;

  useEffect(() => {
    setConnect(true, roomName);
    setMode('story');
    if (isConnected && roomName) {
      setRoomId(`drawing_${roomName}`);
    }
    if (sketchPath) {
      setTemplate({
        sketchId: currentPage?.pageId ?? 0,
        sketchTitle: `Page ${currentPage?.pageNumber}`,
        sketchPath,
      });
    }
    if (!isRecording.current) {
      const data: DrawingParticipationRecordData = {
        childId: useSubAccountStore.getState().selectedAccount?.childId ?? 0,
        mode: 'STORY',
      };
      setSessionId(data);
      isRecording.current = true;
    }
    return () => {
      setConnect(false);
      setTemplate(null);
      setMode(null);
    };
  }, []);

  const calculateCanvasDimensions = () => {
    const maxHeight = window.innerHeight * 0.9 - 80;
    const maxWidth = window.innerWidth * 0.9;
    const proposedWidth = maxHeight * 1.6;

    if (proposedWidth <= maxWidth) {
      return {
        height: maxHeight,
        width: proposedWidth,
      };
    }
    return {
      height: maxWidth / 1.6,
      width: maxWidth,
    };
  };

  const { height: canvasHeight, width: canvasWidth } = calculateCanvasDimensions();

  return (
    <div className="bg-yellow-600 w-full h-full flex flex-col items-center justify-between m-0 p-0">
      <div className="w-full h-20 flex justify-between m-0 p-0">
        <span className="mt-4 ms-4">
          <SaveButton
            canvasRef={canvasRef}
            handleNext={handleNext}
          />
        </span>
        <span className="content-end flex">
          <Palette />
        </span>
      </div>
      <div className="m-5 bg-white">
        <DrawingCanvas
          canvasHeight={canvasHeight}
          canvasWidth={canvasWidth}
          setDrawingCanvasRef={setCanvasRef}
        />
      </div>
    </div>
  );
}

export default StoryDrawingPage;
