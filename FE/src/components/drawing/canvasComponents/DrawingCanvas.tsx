import {
  useState, useRef, useEffect, useCallback,
} from 'react';
import { useDrawing } from '@/stores/drawing/drawingStore';
import { getOutlinePath } from '@/utils/format/imgPath';
import useSocketStore from '../hooks/useSocketStore';

const baseWidth: number = 1600;

export interface DrawingCanvasProps {
  canvasHeight: number;
  canvasWidth: number;
  setDrawingCanvasRef:React.Dispatch<React.SetStateAction<HTMLCanvasElement | null>>;
}

export interface Pos {
  x: number;
  y: number;
}

export interface LineData {
  width: number;
  prevX: number;
  prevY: number;
  curX: number;
  curY: number;
}

export interface DrawingData {
  status: string;
  color: string;
  width: number;
  prevX: number;
  prevY: number;
  curX: number;
  curY: number;
}

function DrawingCanvas({
  canvasHeight, canvasWidth, setDrawingCanvasRef,
}: DrawingCanvasProps): JSX.Element {
  const {
    mode, template, isErasing, penColor, penWidth,
  } = useDrawing();

  const {
    socket,
  } = useSocketStore();

  const containerRef = useRef<HTMLDivElement>(null); // 캔버스 영역 div
  const outlineImgSrc = template ? getOutlinePath(template.sketchPath) : '';

  const outlineCanvasRef = useRef<HTMLCanvasElement>(null); // 그림 윤곽선 레이어
  const canvasRef = useRef<HTMLCanvasElement>(null); // 그림 그리기 레이어
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>(); // 그림 그리기 레이어 context

  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [newLine, setNewLine] = useState<LineData>({
    width: 0, prevX: -100, prevY: -100, curX: -100, curY: -100,
  });

  let lineWidth = penWidth;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventTouchScroll = (event: TouchEvent) => {
      event.preventDefault();
    };

    // 부모 컨테이너에 이벤트 리스너 추가
    container.addEventListener('touchstart', preventTouchScroll, { passive: false });
    container.addEventListener('touchmove', preventTouchScroll, { passive: false });

    // eslint-disable-next-line consistent-return
    return () => {
      container.removeEventListener('touchstart', preventTouchScroll);
      container.removeEventListener('touchmove', preventTouchScroll);
    };
  }, []);

  // 상대적 캔버스 크기 비율
  const canvasScale: number = canvasWidth / baseWidth;

  // 캔버스 배경
  const drawBackgroundImg = useCallback(() => {
    if (!outlineCanvasRef.current) return;
    const context = outlineCanvasRef.current.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, canvasWidth, canvasHeight);

    const img = new Image();
    img.src = outlineImgSrc;
    img.onload = () => {
      context.drawImage(img, 0, 0, canvasWidth, canvasHeight);
    };
  }, [outlineImgSrc, canvasWidth, canvasHeight]);

  useEffect(() => {
    drawBackgroundImg();
  }, [drawBackgroundImg]);

  useEffect(() => {
    lineWidth = penWidth;
  }, [penWidth]);

  // 드로잉 레이어 설정
  // Canvas에 focus 설정
  useEffect(() => {
    if (!canvasRef.current) return;
    canvasRef.current.focus();
    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    context.strokeStyle = penColor;
    context.lineWidth = lineWidth * canvasScale;
    context.lineJoin = 'round';
    context.lineCap = 'round';

    setCtx(context);

    setDrawingCanvasRef(canvasRef.current);
  }, [canvasScale, setDrawingCanvasRef]);

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
    status, color, width, prevX, prevY, curX, curY,
  }: DrawingData) {
    if (!ctx) return;
    if (status === 'erase') {
      ctx.globalCompositeOperation = 'destination-out';
      const eraserWidth = width * canvasScale * 2;
      ctx.lineWidth = eraserWidth;

      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(curX, curY);
      ctx.stroke();

      ctx.globalCompositeOperation = 'source-over';
    } else if (status === 'draw') {
      ctx.lineWidth = width * canvasScale;
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
    if (!socket) return;
    if (isErasing) {
      socket.emit('message', {
        status: 'erase',
        width: lineWidth,
        prevX: prevX / canvasScale,
        prevY: prevY / canvasScale,
        curX: curX / canvasScale,
        curY: curY / canvasScale,
      });
    } else {
      socket.emit('message', {
        status: 'draw',
        color: penColor,
        width: lineWidth,
        prevX: prevX / canvasScale,
        prevY: prevY / canvasScale,
        curX: curX / canvasScale,
        curY: curY / canvasScale,
      });
    }
  }

  useEffect(() => {
    if ((mode === 'together' || mode === 'story') && newLine) {
      sendStrokeData(newLine);
    }
  }, [newLine]);

  function startDrawing({ nativeEvent }: { nativeEvent: MouseEvent | TouchEvent }) {
    setIsDrawing(true);
    const { x, y }: Pos = getPosition(nativeEvent);
    setNewLine({
      width: lineWidth, prevX: x, prevY: y, curX: x, curY: y,
    });
    if (mode === 'single') {
      stroke({
        status: isErasing ? 'erase' : 'draw',
        color: penColor,
        width: lineWidth,
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
        width: lineWidth,
        prevX: newLine.curX,
        prevY: newLine.curY,
        curX: x,
        curY: y,
      });
    }
    setNewLine({
      width: lineWidth, prevX: newLine.curX, prevY: newLine.curY, curX: x, curY: y,
    });
  }

  function endDrawing() {
    setIsDrawing(false);
  }

  // socket.io의 그림 정보 수신
  useEffect(() => {
    if (!socket) return;
    socket.on('message', (data: DrawingData) => {
      if (!ctx) return;
      stroke({
        status: data.status,
        color: data.color,
        width: data.width,
        prevX: data.prevX * canvasScale,
        prevY: data.prevY * canvasScale,
        curX: data.curX * canvasScale,
        curY: data.curY * canvasScale,
      });
    });
  });

  return (
    <div
      className="canvas"
      style={{ position: 'relative', height: canvasHeight, width: canvasWidth }}
      ref={containerRef}
    >
      <canvas
        width={canvasWidth}
        height={canvasHeight}
        style={{
          position: 'absolute', top: 0, left: 0, zIndex: 0, margin: 0,
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
          position: 'absolute', top: 0, left: 0, zIndex: 1, margin: 0, pointerEvents: 'none',
        }}
        ref={outlineCanvasRef}
      />
    </div>
  );
}

export default DrawingCanvas;
