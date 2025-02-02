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
    imageData,
  } = useDrawing();

  useEffect(() => {
    onDrawingResult(imageData);
    console.log(imageData);
  }, [imageData]);

  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);

  const canvasHeight = window.innerHeight * 0.6;
  const canvasWidth = canvasHeight * 1.6;

  return (
    <div className="bg-yellow-600 w-full h-full m-0 p-0 relative">
      <div className="absolute top-0 right-0 w-full h-20 flex justify-end m-0 p-0 z-1">
        <span className="mt-4 ms-4 me-4">
          <SaveButton canvasRef={canvasRef} />
        </span>
      </div>
      <div className="absolute top-2 left-0 w-20 h-auto flex flex-col transform rotate-90 origin-top-left -scale-y-100 z-1">
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

export default DrawingPage;
