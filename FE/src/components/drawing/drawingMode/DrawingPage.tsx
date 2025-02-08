import { useState } from 'react';
import DrawingCanvas from '../canvasComponents/DrawingCanvas';
import Palette from '../canvasComponents/Color';
import SaveButton from '../canvasComponents/SaveButton';

function DrawingPage(): JSX.Element {
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);

  // 캔버스 크기 계산
  const calculateCanvasDimensions = () => {
    // 화면 높이의 80%에서 상단 네비게이션 바 높이(5rem = 80px)를 뺀 값
    const maxHeight = window.innerHeight * 0.9 - 80;
    const maxWidth = window.innerWidth * 0.9; // 화면 너비의 90%

    // 기본 비율 1.6:1 유지
    const proposedWidth = maxHeight * 1.6;

    if (proposedWidth <= maxWidth) {
      // 높이 기준으로 계산
      return {
        height: maxHeight,
        width: proposedWidth,
      };
    }
    // 너비 기준으로 계산
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
