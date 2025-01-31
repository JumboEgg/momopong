import {
  useState, useRef, useEffect, useCallback,
} from 'react';
import io from 'socket.io-client';
import { getOutlineSrc } from '../utils/getImgSrc';
import { useDrawing } from '../contexts/DrawingContext';

const socket = io('http://localhost:3869');

const baseWidth: number = 1600;
const basePenWidth: number = 30;

export interface DrawingCanvasProps {
  canvasHeight: number;
  canvasWidth: number;
  setDrawingCanvasRef: HTMLCanvasElement;
}

export interface Pos {
  x: number;
  y: number;
}

export interface LineData {
  prevX: number;
  prevY: number;
  curX: number;
  curY: number;
}

export interface drawingData {
  status: string;
  color: string;
  prevX: number;
  prevY: number;
  curX: number;
  curY: number;
}

function DrawingCanvas({
  canvasHeight, canvasWidth, setDrawingCanvasRef,
}: DrawingCanvasProps): JSX.Element {
  const {
    mode, templateId, isErasing, penColor,
  } = useDrawing();

  const containerRef = useRef<HTMLDivElement>(null); // 캔버스 영역 div

  // const bgImgSrc = getBackgroundSrc(templateId);
  const outlineImgSrc = getOutlineSrc(templateId);

  const outlineCanvasRef = useRef<HTMLCanvasElement>(null); // 그림 윤곽선 레이어
  const canvasRef = useRef<HTMLCanvasElement>(null); // 그림 그리기 레이어
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>(); // 그림 그리기 레이어 context

  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [newLine, setNewLine] = useState<LineData>({
    prevX: -100, prevY: -100, curX: -100, curY: -100,
  });

  useEffect(() => {
    setDrawingCanvasRef(canvasRef);
  }, [canvasRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventTouchScroll = (event: TouchEvent) => {
      event.preventDefault();
    };

    // 부모 컨테이너에 이벤트 리스너 추가
    container.addEventListener('touchstart', preventTouchScroll, { passive: false });
    container.addEventListener('touchmove', preventTouchScroll, { passive: false });

    // TODO : 형식 변경 후에도 터치 인식 되는지 확인
    // return () => {
    container.removeEventListener('touchstart', preventTouchScroll);
    container.removeEventListener('touchmove', preventTouchScroll);
    // };
  }, []);

  // 상대적 캔버스 크기 비율
  const canvasScale: number = canvasWidth / baseWidth;

  // 캔버스 배경
  const drawBackgroundImg = useCallback(() => {
    if (!outlineCanvasRef.current) return;
    const context = outlineCanvasRef.current.getContext('2d');
    if (!context) return;

    const img = new Image();
    img.src = outlineImgSrc;
    img.onload = () => {
      context.drawImage(img, 0, 0, canvasWidth, canvasHeight);
    };
  }, []);

  useEffect(() => {
    drawBackgroundImg();
  }, [drawBackgroundImg]);

  // 드로잉 레이어 설정
  // Canvas에 focus 설정
  useEffect(() => {
    if (!canvasRef.current) return;
    canvasRef.current.focus();
    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    context.strokeStyle = penColor;
    context.lineWidth = basePenWidth * canvasScale;
    context.lineJoin = 'round';
    context.lineCap = 'round';

    setCtx(context);
  });

  // 펜 색상 변경
  useEffect(() => {
    if (ctx) ctx.strokeStyle = penColor;
  }, [penColor, ctx]);

  // 클릭/터치 좌표 계산
  function getPosition(
    e: MouseEvent | TouchEvent,
  ): Pos {
    let x: number = 0;
    let y: number = 0;
    if (e instanceof MouseEvent) {
      x = e.offsetX;
      y = e.offsetY;
    } else {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    }
    return { x, y };
  }

  function stroke({
    status, color, prevX, prevY, curX, curY,
  }: drawingData) {
    if (!ctx) return;

    if (status === 'erase') {
      ctx.globalCompositeOperation = 'destination-out';
      const eraserWidth = basePenWidth * canvasScale * 2;
      ctx.lineWidth = eraserWidth;

      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(curX, curY);
      ctx.stroke();

      ctx.lineWidth = basePenWidth * canvasScale;
      ctx.globalCompositeOperation = 'source-over';
    } else if (status === 'draw') {
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(curX, curY);
      ctx.stroke();
    }
  }

  function sendStrokeData({
    prevX, prevY, curX, curY,
  }: LineData) {
    if (isErasing) {
      socket.emit('message', {
        status: 'erase',
        prevX: prevX / canvasScale,
        prevY: prevY / canvasScale,
        curX: curX / canvasScale,
        curY: curY / canvasScale,
      });
    } else {
      socket.emit('message', {
        status: 'draw',
        penColor,
        prevX: prevX / canvasScale,
        prevY: prevY / canvasScale,
        curX: curX / canvasScale,
        curY: curY / canvasScale,
      });
    }
  }

  useEffect(() => {
    if (mode === 'together' && newLine) {
      sendStrokeData(newLine);
    }
  }, [newLine]);

  function startDrawing({ nativeEvent }: { nativeEvent: MouseEvent | TouchEvent }) {
    setIsDrawing(true);
    const { x, y }: Pos = getPosition(nativeEvent);
    setNewLine({
      prevX: x, prevY: y, curX: x, curY: y,
    });
    if (mode === 'single') {
      stroke({
        status: isErasing ? 'erase' : 'draw',
        color: penColor,
        prevX: x,
        prevY: y,
        curX: x,
        curY: y,
      });
    }
  }

  function draw({ nativeEvent }: { nativeEvent: MouseEvent | TouchEvent }) {
    const { x, y }: Pos = getPosition(nativeEvent);
    if (!ctx) return;
    if (!isDrawing) return;
    if (mode === 'single') {
      stroke({
        status: isErasing ? 'erase' : 'draw',
        color: penColor,
        prevX: newLine.curX,
        prevY: newLine.curY,
        curX: x,
        curY: y,
      });
    }
    setNewLine({
      prevX: newLine.curX, prevY: newLine.curY, curX: x, curY: y,
    });
  }

  function endDrawing() {
    setIsDrawing(false);
  }

  // socket.io의 그림 정보 수신
  useEffect(() => {
    socket.on('message', (data: drawingData) => {
      if (!ctx) return;
      stroke({
        status: data.status,
        color: data.color,
        prevX: data.prevX * canvasScale,
        prevY: data.prevY * canvasScale,
        curX: data.curX * canvasScale,
        curY: data.curY * canvasScale,
      });
    });
  });

  // // 캔버스 로컬에 저장
  // function saveCanvas() {
  //   if (!canvasRef.current) return;
  //   const currentCanvas = canvasRef.current;
  //   if (!currentCanvas) return;

  //   const tempCanvas = document.createElement('canvas');
  //   const tempCtx = tempCanvas.getContext('2d');
  //   if (!tempCtx) return;

  //   tempCanvas.width = canvasWidth;
  //   tempCanvas.height = canvasHeight;

  //   const bgImg = new Image();
  //   bgImg.src = bgImgSrc;
  //   bgImg.onload = () => {
  //     tempCtx.drawImage(bgImg, 0, 0, canvasWidth, canvasHeight);
  //     tempCtx.drawImage(currentCanvas, 0, 0);

  //     const outlineImg = new Image();
  //     outlineImg.src = outlineImgSrc;
  //     outlineImg.onload = () => {
  //       tempCtx.drawImage(outlineImg, 0, 0, canvasWidth, canvasHeight);
  //       const dataURL = tempCanvas.toDataURL('image/png');
  //       setImageData(dataURL);
  //     };
  //   };
  // }

  return (
    <div
      className="canvas"
      style={{ position: 'relative', height: canvasHeight, width: canvasWidth }}
      ref={containerRef}
    >
      <canvas
        className="bg-white"
        width={canvasWidth}
        height={canvasHeight}
        style={{
          position: 'absolute', top: 0, left: 0, zIndex: 0, margin: 0,
        }}
      />
      <canvas
        width={canvasWidth}
        height={canvasHeight}
        style={{
          position: 'absolute', top: 0, left: 0, zIndex: 1, margin: 0,
        }}
        tabIndex={0}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endDrawing}
        onTouchCancel={endDrawing}
        ref={canvasRef}
      />
      <canvas // 윤곽선
        width={canvasWidth}
        height={canvasHeight}
        style={{
          position: 'absolute', top: 0, left: 0, zIndex: 2, margin: 0, pointerEvents: 'none',
        }}
        ref={outlineCanvasRef}
      />
    </div>
  );
}

export default DrawingCanvas;
