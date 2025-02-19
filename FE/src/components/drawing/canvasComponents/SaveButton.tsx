import TextButton, { ButtonSize } from '@/components/common/buttons/TextButton';
import { useCallback, useEffect, useState } from 'react';
import { useDrawing } from '@/stores/drawing/drawingStore';
import { getBackgroundPath, getOutlinePath } from '@/utils/format/imgPath';
import { IconCircleButton } from '@/components/common/buttons/CircleButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { useRecordList } from '@/stores/book/bookRecordListStore';

export interface SaveButtonProps {
  canvasRef: HTMLCanvasElement | null;
}

function SaveButton({ canvasRef }: SaveButtonProps) {
  const {
    mode, template, setImageData,
  } = useDrawing();

  const {
    setDrawingResult,
  } = useRecordList();

  const [buttonSize, setButtonSize] = useState<ButtonSize>('sm');

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
      // endSketchSession();
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
  }, [canvasRef]);

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
      {
        buttonSize === 'md'
        ? <TextButton className="ps-6 pe-6" onClick={saveCanvas} size={buttonSize} variant="rounded">다 그렸어!</TextButton>
        : <IconCircleButton icon={<FontAwesomeIcon icon={faSave} onClick={saveCanvas} size="lg" />} size="sm" variant="story" />
      }
    </div>
  );
}

export default SaveButton;
