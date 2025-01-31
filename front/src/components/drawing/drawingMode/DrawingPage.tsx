import { useEffect, useState } from 'react';
import DrawingCanvas from '../canvasComponents/DrawingCanvas';
import Palette from '../canvasComponents/Color';
import { useDrawing } from '../contexts/DrawingContext';
import { getBackgroundSrc, getOutlineSrc } from '../utils/getImgSrc';

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

  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement>(null);

  const canvasHeight = mode === 'story' ? window.innerHeight * 0.6 : window.innerHeight * 0.8;
  const canvasWidth = canvasHeight * 1.6;

  const {
    templateId, setImageData,
  } = useDrawing();

  const bgImgSrc = getBackgroundSrc(templateId);
  const outlineImgSrc = getOutlineSrc(templateId);

  function saveCanvas() {
    if (!canvasRef.current) return;
    const currentCanvas = canvasRef.current;
    if (!currentCanvas) return;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;

    const bgImg = new Image();
    bgImg.src = bgImgSrc;
    bgImg.onload = () => {
      tempCtx.drawImage(bgImg, 0, 0, canvasWidth, canvasHeight);
      tempCtx.drawImage(currentCanvas, 0, 0);

      const outlineImg = new Image();
      outlineImg.src = outlineImgSrc;
      outlineImg.onload = () => {
        tempCtx.drawImage(outlineImg, 0, 0, canvasWidth, canvasHeight);
        const dataURL = tempCanvas.toDataURL('image/png');
        setImageData(dataURL);
      };
    };
  }

  return (
    <div className="bg-amber-700 w-full h-full flex flex-col items-center justify-center">
      <button type="button" onClick={saveCanvas}>다 그렸어</button>
      <div className="w-2xl h-20 place-self-end me-10">
        <Palette />
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
