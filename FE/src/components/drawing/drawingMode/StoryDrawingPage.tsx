import { useEffect, useState } from 'react';
import { useDrawing } from '@/stores/drawing/drawingStore';
import { useBookContent } from '@/stores/book/bookContentStore';
import { useStory } from '@/stores/storyStore';
import DrawingCanvas from '../canvasComponents/DrawingCanvas';
import Palette from '../canvasComponents/Color';
import SaveButton from '../canvasComponents/SaveButton';
import useSocketStore from '../hooks/useSocketStore';
import PenWidth from '../canvasComponents/PenWidth';

interface StoryDrawingPageProps {
  roomName: string;
  userRole: 'role1' | 'role2';
  handleNext: () => void;
}

function StoryDrawingPage({ roomName, userRole, handleNext }: StoryDrawingPageProps): JSX.Element {
  const { setTemplate, setMode } = useDrawing();
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const { setConnect, setRoomId, isConnected } = useSocketStore();
  const { currentIndex } = useStory();
  const { bookContent } = useBookContent();
  const currentPage = bookContent?.pages[currentIndex];
  const sketchPath = currentPage?.position?.sketchPath;

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
    return () => {
      setConnect(false);
      setTemplate(null);
      setMode(null);
    };
  }, []);

  // 캔버스 크기 계산
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
        <span className="fixed top-2 md:top-4 left-2 md:left-4 z-30">
          <SaveButton
            canvasRef={canvasRef}
            userRole={userRole}
            endDrawing={handleNext}
          />
        </span>
        <span className="fixed top-0 right-0 flex">
          <Palette />
        </span>
      </div>
      <div className="fixed top-30 left-2 md:left-5 bg-gray-100 rounded-full p-2 md:p-5 z-10">
        <PenWidth radius={canvasWidth / 1600} />
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
