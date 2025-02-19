import { useState, useCallback, useEffect } from 'react';
import TextButton, { ButtonSize } from '@/components/common/buttons/TextButton';
import { useDrawing } from '@/stores/drawing/drawingStore';
import { getBackgroundPath, getOutlinePath } from '@/utils/format/imgPath';
import { IconCircleButton } from '@/components/common/buttons/CircleButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { useRecordList } from '@/stores/book/bookRecordListStore';
import useSocketStore from '../hooks/useSocketStore';
import { data } from 'react-router-dom';

export interface SaveButtonProps {
  canvasRef: HTMLCanvasElement | null;
  handleNext: () => void;
}

interface DrawingMessageData {
  status: string;
  color: string;
  prevX: number;
  prevY: number;
  curX: number; 
  curY: number;
  roomId?: string; // optional로 설정 (필요시에만 포함)
}

function SaveButton({ canvasRef, handleNext }: SaveButtonProps) {
  const { mode, template, setImageData } = useDrawing();
  const { setDrawingResult } = useRecordList();
  const { socket, isConnected } = useSocketStore();
  const [buttonSize, setButtonSize] = useState<ButtonSize>('sm');
  const [drawingCompleted, setDrawingCompleted] = useState(false);
  const [partnerCompleted, setPartnerCompleted] = useState(false);

  const canvasWidth = 1600;
  const canvasHeight = 1000;

  let bgImgSrc = '';
  let outlineImgSrc = '';

  if (template) {
    bgImgSrc = getBackgroundPath(template.sketchPath);
    outlineImgSrc = getOutlinePath(template.sketchPath);
  }

  const saveCanvas = useCallback(() => {
    if (!canvasRef) return;
    const currentCanvas = canvasRef;
    if (!currentCanvas) return;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;

    if (mode === 'story') {
      const bgImg = new Image();
      bgImg.src = bgImgSrc;
      bgImg.onload = () => {
        tempCtx.drawImage(bgImg, 0, 0, canvasWidth, canvasHeight);
        tempCtx.drawImage(currentCanvas, 0, 0, canvasWidth, canvasHeight);

        const outlineImg = new Image();
        outlineImg.src = outlineImgSrc;
        outlineImg.onload = () => {
          tempCtx.drawImage(outlineImg, 0, 0, canvasWidth, canvasHeight);
          const dataURL = tempCanvas.toDataURL('image/webp');
          setDrawingResult(dataURL);
        };
      };
    } else {
      tempCtx.fillStyle = 'white';
      tempCtx.fillRect(0, 0, canvasWidth, canvasHeight);
      tempCtx.drawImage(currentCanvas, 0, 0, canvasWidth, canvasHeight);

      const outlineImg = new Image();
      outlineImg.src = outlineImgSrc;
      outlineImg.onload = () => {
        tempCtx.drawImage(outlineImg, 0, 0, canvasWidth, canvasHeight);
        const dataURL = tempCanvas.toDataURL('image/webp');
        setImageData(dataURL);
      };
    }

    console.log('drawingCompleted', drawingCompleted);
    console.log('partnerCompleted', partnerCompleted);

    // 버튼을 누르면 "대기 중.." 상태로 변경
    setDrawingCompleted(true);

    // 상대방에게 완료 신호 전송
    if (socket && isConnected) {
      const completeData = {
        status: 'drawing-complete', // 이 필드가 중요합니다!
        color: '',
        prevX: 0,
        prevY: 0,
        curX: 0,
        curY: 0
      };
      console.log('@@@@@complete@@@@@', completeData);
      socket.emit('message', completeData);
      // socket.emit('drawing-complete');
    }
  }, [canvasRef, socket, isConnected]);

  useEffect(() => {
    // 상대방이 버튼을 눌렀을 때 이벤트 수신
    console.log('@@@@socket@@@@@', socket);
    console.log('drawingCompleted', drawingCompleted);
    console.log('partnerCompleted', partnerCompleted);

    if (!socket) return;

    const handlePartnerComplete = (data: DrawingMessageData | null) => {
      if (data && data.status === 'drawing-complete') {
        console.log('상대방 완료 신호 수신:', data);
        setPartnerCompleted(true);
      }
    };

    socket.on('message', handlePartnerComplete);
    // socket.on('drawing-complete', handlePartnerComplete);

    return () => {
      socket.off('message', handlePartnerComplete);
      // socket.off('drawing-complete', handlePartnerComplete);
    };
  }, [socket]);

  useEffect(() => {
    // 두 명 모두 버튼을 눌렀으면 handleNext 실행
    console.log("drawingCompleted@@@@@@@@partnerCompleted");
    console.log('drawingCompleted', drawingCompleted);
    console.log('partnerCompleted', partnerCompleted);

    if (drawingCompleted && partnerCompleted) {
      handleNext();
    }
  }, [drawingCompleted, partnerCompleted, handleNext]);

  useEffect(() => {
    const updateSize = () => {
      setButtonSize(window.innerWidth >= 768 ? 'md' : 'sm'); // 768px(md) 기준 변경
    };

    updateSize(); // 초기 실행
    window.addEventListener('resize', updateSize); // 리사이즈 이벤트 리스너 등록

    return () => window.removeEventListener('resize', updateSize); // 클린업
  }, []);

  return (
    <div>
      {buttonSize === 'md' ? (
        <TextButton className="ps-6 pe-6" onClick={saveCanvas} size={buttonSize} variant="rounded">
          {drawingCompleted ? '대기 중..' : '다 그렸어!'}
        </TextButton>
      ) : (
        <IconCircleButton
          icon={<FontAwesomeIcon icon={faSave} onClick={saveCanvas} size="lg" />}
          size="sm"
          variant="story"
        />
      )}
    </div>
  );
}

export default SaveButton;
