import { useState } from 'react';
import DrawingCanvas from '../canvasComponents/DrawingCanvas';
import Palette from '../canvasComponents/Color';
import SaveButton from '../canvasComponents/SaveButton';

function DrawingPage(): JSX.Element {
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);

  const canvasHeight = window.innerHeight * 0.8;
  const canvasWidth = canvasHeight * 1.6;

  return (
    <div className="bg-yellow-600 w-full h-full flex flex-col items-center justify-between m-0 p-0">
      <div className="w-full h-20 flex justify-between m-0 p-0">
        <span className="mt-4 ms-4">
          <SaveButton
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            canvasRef={canvasRef}
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

export default DrawingPage;
