import {
  useState, useRef, useEffect, useCallback,
  useMemo,
} from 'react';
import io from 'socket.io-client';
import { getBackgroundSrc, getOutlineSrc } from '../utils/getImgSrc';
import { useDrawing } from '../contexts/DrawingContext';

const socket = io('http://localhost:3869');

const baseWidth: number = 1600;
const basePenWidth: number = 30;

export interface pos {
  x: number;
  y: number;
}

export interface drawingData {
  status: string;
  color: string;
  prevX: number;
  prevY: number;
  curX: number;
  curY: number;
}

function DrawingCanvas(): JSX.Element {
  const {
    mode, templateId, isErasing, penColor, setImageData,
  } = useDrawing();

  const containerRef = useRef<HTMLDivElement>(null); // 캔버스 영역 div

  const bgImgSrc = getBackgroundSrc(templateId);
  const outlineImgSrc = getOutlineSrc(templateId);

  const canvasRatio: number = 1.6; // 캔버스 가로세로 비율
  const outlineCanvasRef = useRef<HTMLCanvasElement>(null); // 그림 윤곽선 레이어
  const canvasRef = useRef<HTMLCanvasElement>(null); // 그림 그리기 레이어
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>(); // 그림 그리기 레이어 context

  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [prevPos, setPrevPos] = useState<pos>({ x: 0, y: 0 }); // 내 그리기 이전 지점

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

  const canvasSize = useMemo(
    () => ({
      width: window.innerHeight * canvasRatio * 0.8,
      height: window.innerHeight * 0.8,
    }),
    [],
  );

  // 상대적 캔버스 크기 비율
  const canvasScale: number = canvasSize.width / baseWidth;

  // 캔버스 배경
  const drawBackgroundImg = useCallback(() => {
    if (!outlineCanvasRef.current) return;
    const context = outlineCanvasRef.current.getContext('2d');
    if (!context) return;

    const img = new Image();
    img.src = outlineImgSrc;
    img.onload = () => {
      context.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);
    };
  }, [canvasSize]);

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
  ): pos {
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
    } else {
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(curX, curY);
      ctx.stroke();
    }
  }

  function sendStrokeData({ x, y }: pos) {
    if (isErasing) {
      socket.emit('message', {
        status: 'erase',
        prevX: prevPos.x / canvasScale,
        prevY: prevPos.y / canvasScale,
        curX: x / canvasScale,
        curY: y / canvasScale,
      });
    } else {
      socket.emit('message', {
        status: 'draw',
        penColor,
        prevX: prevPos.x / canvasScale,
        prevY: prevPos.y / canvasScale,
        curX: x / canvasScale,
        curY: y / canvasScale,
      });
    }
  }

  function startDrawing({ nativeEvent }: { nativeEvent: MouseEvent | TouchEvent }) {
    setIsDrawing(true);
    const { x, y }: pos = getPosition(nativeEvent);
    setPrevPos({ x, y });
    if (mode === 'together') sendStrokeData({ x, y });
    else {
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
    const { x, y }: pos = getPosition(nativeEvent);
    if (!ctx) return;
    if (!isDrawing) return;
    if (mode === 'together') sendStrokeData({ x, y });
    else {
      // console.log(`draw from (${prevPos.x}, ${prevPos.y}) to (${x}, ${y})`);
      stroke({
        status: isErasing ? 'erase' : 'draw',
        color: penColor,
        prevX: prevPos.x,
        prevY: prevPos.y,
        curX: x,
        curY: y,
      });
    }
    setPrevPos({ x, y });
  }

  function endDrawing() {
    setIsDrawing(false);
  }

  // socket.io의 그림 정보 수신
  useEffect(() => {
    socket.on('message', (data: drawingData) => {
      if (!ctx) return;
      stroke(data);
    });
  });

  // 캔버스 로컬에 저장
  function saveCanvas() {
    if (!canvasRef.current) return;
    const currentCanvas = canvasRef.current;
    if (!currentCanvas) return;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCanvas.width = canvasSize.width;
    tempCanvas.height = canvasSize.height;

    const bgImg = new Image();
    bgImg.src = bgImgSrc;
    bgImg.onload = () => {
      tempCtx.drawImage(bgImg, 0, 0, canvasSize.width, canvasSize.height);
      tempCtx.drawImage(currentCanvas, 0, 0);

      const outlineImg = new Image();
      outlineImg.src = outlineImgSrc;
      outlineImg.onload = () => {
        tempCtx.drawImage(outlineImg, 0, 0, canvasSize.width, canvasSize.height);
        const dataURL = tempCanvas.toDataURL('image/png');
        setImageData(dataURL);
      };
    };
  }

  return (
    <div
      className="canvas"
      style={{ position: 'relative', height: canvasSize.height }}
      ref={containerRef}
    >
      <canvas
        width={canvasSize.width}
        height={canvasSize.height}
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
        width={canvasSize.width}
        height={canvasSize.height}
        style={{
          position: 'absolute', top: 0, left: 0, zIndex: 1, margin: 0, pointerEvents: 'none',
        }}
        ref={outlineCanvasRef}
      />
      <div style={{ position: 'absolute', top: '100%' }}>
        <div>
          <button type="button" onClick={saveCanvas}>Save Canvas</button>
        </div>
      </div>
    </div>
  );
}

export default DrawingCanvas;
