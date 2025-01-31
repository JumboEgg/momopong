import { useEffect } from 'react';
import DrawingCanvas from '../canvasComponents/DrawingCanvas';
import Palette from '../canvasComponents/Color';
import { useDrawing } from '../contexts/DrawingContext';

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

  const canvasHeight = mode === 'story' ? window.innerHeight * 0.6 : window.innerHeight * 0.8;
  const canvasWidth = canvasHeight * 1.6;

  return (
    <div className="bg-amber-700 w-full h-full flex flex-col items-center justify-center">
      <div className="w-2xl h-20 place-self-end me-10">
        <Palette />
      </div>
      <div className="m-5">
        <DrawingCanvas canvasHeight={canvasHeight} canvasWidth={canvasWidth} />
      </div>
    </div>
  );
}

export default DrawingPage;
