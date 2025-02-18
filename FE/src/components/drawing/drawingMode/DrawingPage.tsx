import { useEffect, useRef, useState } from 'react';
import { useDrawing } from '@/stores/drawing/drawingStore';
import { DrawingParticipationRecordData } from '@/types/sketch';
import useSubAccountStore from '@/stores/subAccountStore';
import DrawingCanvas from '../canvasComponents/DrawingCanvas';
import Palette from '../canvasComponents/Color';
import SaveButton from '../canvasComponents/SaveButton';
import PenWidth from '../canvasComponents/PenWidth';

function DrawingPage(): JSX.Element {
  const { mode, setSessionId } = useDrawing();
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const isRecording = useRef(false);

  useEffect(() => {
    if (isRecording.current) return;
    const data: DrawingParticipationRecordData = {
      childId: useSubAccountStore.getState().selectedAccount?.childId ?? 0,
      mode: mode === 'single' ? 'SINGLE' : 'MULTI',
    };
    setSessionId(data);
    isRecording.current = true;
  }, []);

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
        <span className="fixed top-2 md:top-4 left-2 md:left-4 z-30">
          <SaveButton
            canvasRef={canvasRef}
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

export default DrawingPage;
