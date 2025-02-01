import { useEffect, useState } from 'react';
import DrawingCanvas from '../canvasComponents/DrawingCanvas';
import Palette from '../canvasComponents/Color';
import { useDrawing } from '../contexts/DrawingContext';
import SaveButton from '../canvasComponents/SaveButton';

interface DrawingPageProps {
  onDrawingResult: (resultSrc: string) => void;
}

function DrawingPage({ onDrawingResult }: DrawingPageProps): JSX.Element {
  const {
    imageData, mode,
  } = useDrawing();

  useEffect(() => {
    onDrawingResult(imageData);
  }, [imageData]);

  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);

  const canvasHeight = mode === 'story' ? window.innerHeight * 0.6 : window.innerHeight * 0.8;
  const canvasWidth = canvasHeight * 1.6;

  return (
    <div className="bg-yellow-600 w-full h-full flex flex-col items-center justify-between m-0 p-0">
      <div className="w-full h-20 flex justify-between m-0 p-0">
        <span className="mt-4 ms-4">
          <SaveButton canvasRef={canvasRef} />
        </span>
        <span className="content-end">
          <Palette />
        </span>
      </div>
      <div className="m-5">
        <DrawingCanvas
          canvasHeight={canvasHeight}
          canvasWidth={canvasWidth}
          setDrawingCanvasRef={setCanvasRef}
        />
      </div>
    </div>
  );
}

export default DrawingPage;
