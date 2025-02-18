import TextButton, { ButtonSize } from '@/components/common/buttons/TextButton';
import { useCallback, useEffect, useState } from 'react';
import { useDrawing } from '@/stores/drawing/drawingStore';
import { getBackgroundPath, getOutlinePath } from '@/utils/format/imgPath';
import { useBookSketch } from '@/stores/book/bookSketchStore';
import { IconCircleButton } from '@/components/common/buttons/CircleButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { useRecordList } from '@/stores/book/bookRecordListStore';
import useSocketStore from '../hooks/useSocketStore';

export interface SaveButtonProps {
  canvasRef: HTMLCanvasElement | null;
  onAllSaved?: () => void; // 모든 사용자가 저장했을 때 호출될 콜백
}

function SaveButton({ canvasRef, onAllSaved }: SaveButtonProps) {
  const {
    mode, template, setImageData,
  } = useDrawing();

  // TODO : story mode 저장 테스트 코드 삭제
  const {
    setSketch,
  } = useBookSketch();

  const {
    setDrawingResult,
  } = useRecordList();

  const { socket } = useSocketStore();

  const [buttonSize, setButtonSize] = useState<ButtonSize>('sm');
  const [savedUsers, setSavedUsers] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  const canvasWidth = 1600;
  const canvasHeight = 1000;

  useEffect(() => {
    if (!socket) return;

    // 다른 사용자가 저장했을 때
    socket.on('userSaved', (userId: string) => {
      setSavedUsers(prev => {
        const newSet = new Set(prev);
        newSet.add(userId);
        return newSet;
      });
    });

    // 저장 취소 이벤트
    socket.on('userCanceled', (userId: string) => {
      setSavedUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    // 모든 사용자가 저장 완료했을 때
    socket.on('allSaved', () => {
      if (onAllSaved) {
        onAllSaved();
      }
    });

    return () => {
      socket.off('userSaved');
      socket.off('userCanceled');
      socket.off('allSaved');
    };
  }, [socket, onAllSaved]);


  let bgImgSrc = '';
  let outlineImgSrc = '';

  if (template) {
    bgImgSrc = getBackgroundPath(template.sketchPath);
    outlineImgSrc = getOutlinePath(template.sketchPath);
  }

  const saveCanvas = useCallback(async () => {
    if (!canvasRef || !socket || hasSaved) return;
    
    setIsSaving(true);
    try {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      tempCanvas.width = canvasWidth;
      tempCanvas.height = canvasHeight;

      if (mode === 'story' && template) {
        const bgImgSrc = getBackgroundPath(template.sketchPath);
        const outlineImgSrc = getOutlinePath(template.sketchPath);

        // 배경 이미지 로드
        const bgImg = new Image();
        await new Promise((resolve) => {
          bgImg.onload = resolve;
          bgImg.src = bgImgSrc;
        });
        tempCtx.drawImage(bgImg, 0, 0, canvasWidth, canvasHeight);
        
        // 현재 캔버스 내용 복사
        tempCtx.drawImage(canvasRef, 0, 0, canvasWidth, canvasHeight);

        // 윤곽선 이미지 로드
        const outlineImg = new Image();
        await new Promise((resolve) => {
          outlineImg.onload = resolve;
          outlineImg.src = outlineImgSrc;
        });
        tempCtx.drawImage(outlineImg, 0, 0, canvasWidth, canvasHeight);

        const dataURL = tempCanvas.toDataURL('image/webp');
        setImageData(dataURL);
        setSketch(dataURL);
        setDrawingResult(dataURL);

        // 저장 완료 이벤트 발송
        socket.emit('saveCompleted', socket.id);
        setHasSaved(true);
      }
    } catch (error) {
      console.error('Failed to save canvas:', error);
    } finally {
      setIsSaving(false);
    }
  }, [canvasRef, mode, template, socket, hasSaved]);

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
        <TextButton 
          className={`ps-6 pe-6 ${isSaving ? 'opacity-50' : ''} ${hasSaved ? 'bg-green-500' : ''}`}
          onClick={saveCanvas}
          size={buttonSize}
          variant="rounded"
          disabled={isSaving || hasSaved}
        >
          {hasSaved ? '저장완료!' : isSaving ? '저장중...' : '다 그렸어!'}
        </TextButton>
      ) : (
        <IconCircleButton 
          icon={<FontAwesomeIcon icon={faSave} onClick={saveCanvas} size="lg" />}
          size="sm"
          variant="story"
          disabled={isSaving || hasSaved}
        />
      )}
      {savedUsers.size > 0 && (
        <div className="text-sm text-gray-600 mt-2">
          {savedUsers.size}명이 저장 완료
        </div>
      )}
    </div>
  );
}

export default SaveButton;
