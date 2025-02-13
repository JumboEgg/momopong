import { useState } from 'react';
import DrawingCanvas from '../canvasComponents/DrawingCanvas';
import Palette from '../canvasComponents/Color';
import SaveButton from '../canvasComponents/SaveButton';

function StoryDrawingPage(): JSX.Element {
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);

  const canvasHeight = window.innerHeight * 0.6;
  const canvasWidth = canvasHeight * 1.6;

  return (
    <div className="bg-yellow-600 w-full h-full m-0 p-0 relative">
      <span className="absolute top-4 right-4 p-0 z-1">
        <SaveButton
          canvasRef={canvasRef}
        />
      </span>
      <div className="absolute top-2 left-0 rotate-90 origin-top-left -scale-y-100 z-1">
        <Palette />
      </div>
      <div className="flex justify-center items-center w-full">
        <span className="bg-white mt-10">
          <DrawingCanvas
            canvasHeight={canvasHeight}
            canvasWidth={canvasWidth}
            setDrawingCanvasRef={setCanvasRef}
          />
        </span>
      </div>
    </div>
  );
}

export default StoryDrawingPage;
