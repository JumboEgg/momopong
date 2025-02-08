import TextButton, { ButtonSize } from '@/components/common/buttons/TextButton';
import { useCallback, useEffect, useState } from 'react';
import { useDrawing } from '@/stores/drawingStore';

export interface SaveButtonProps {
  canvasWidth: number;
  canvasHeight: number;
  canvasRef: HTMLCanvasElement | null;
}

function SaveButton({ canvasWidth, canvasHeight, canvasRef }: SaveButtonProps) {
  const {
    mode, template, setImageData,
  } = useDrawing();

  const [buttonSize, setButtonSize] = useState<ButtonSize>('sm');

  let bgImgSrc = '';
  let outlineImgSrc = '';

  if (template) {
    bgImgSrc = template.backgroundSrc ?? '';
    outlineImgSrc = template.outlineSrc ?? '';
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
        tempCtx.drawImage(currentCanvas, 0, 0);

        const outlineImg = new Image();
        outlineImg.src = outlineImgSrc;
        outlineImg.onload = () => {
          tempCtx.drawImage(outlineImg, 0, 0, canvasWidth, canvasHeight);
          const dataURL = tempCanvas.toDataURL('image/webp');

          setImageData(dataURL);
        };
      };
    } else {
      tempCtx.fillStyle = 'white';
      tempCtx.fillRect(0, 0, canvasWidth, canvasHeight);
      tempCtx.drawImage(currentCanvas, 0, 0);

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

  return <TextButton className="ps-6 pe-6" onClick={saveCanvas} size={buttonSize} variant="rounded">다 그렸어!</TextButton>;
}

export default SaveButton;
