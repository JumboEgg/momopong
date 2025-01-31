import { useEffect } from 'react';
import DrawingCanvas from '../canvasComponents/Canvas';
import Palette from '../canvasComponents/Color';
import { useDrawing } from '../contexts/DrawingContext';

interface DrawingPageProps {
  onDrawingResult: (resultSrc: string) => void;
}

function DrawingPage({ onDrawingResult }: DrawingPageProps): JSX.Element {
  const {
    imageData,
  } = useDrawing();

  useEffect(() => {
    onDrawingResult(imageData);
  }, [imageData]);

  return (
    <div>
      <Palette />
      <DrawingCanvas />
    </div>
  );
}

export default DrawingPage;
