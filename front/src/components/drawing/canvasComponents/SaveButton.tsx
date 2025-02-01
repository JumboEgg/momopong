import TextButton from '@/components/common/buttons/TextButton';
import { useCallback } from 'react';
import { useDrawing } from '../contexts/DrawingContext';
import { getBackgroundSrc, getOutlineSrc } from '../utils/getImgSrc';

export interface SaveButtonProps {
  canvasRef: HTMLCanvasElement | null;
}

function SaveButton({ canvasRef }: SaveButtonProps) {
  const {
    mode, templateId, setImageData,
  } = useDrawing();

  const canvasHeight = mode === 'story' ? window.innerHeight * 0.6 : window.innerHeight * 0.8;
  const canvasWidth = canvasHeight * 1.6;

  const bgImgSrc = getBackgroundSrc(templateId);
  const outlineImgSrc = getOutlineSrc(templateId);

  const saveCanvas = useCallback(() => {
    if (!canvasRef) return;
    const currentCanvas = canvasRef;
    if (!currentCanvas) return;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;

    const bgImg = new Image();
    bgImg.src = bgImgSrc;
    bgImg.onload = () => {
      tempCtx.drawImage(bgImg, 0, 0, canvasWidth, canvasHeight);
      tempCtx.drawImage(currentCanvas, 0, 0);

      const outlineImg = new Image();
      outlineImg.src = outlineImgSrc;
      outlineImg.onload = () => {
        tempCtx.drawImage(outlineImg, 0, 0, canvasWidth, canvasHeight);
        const dataURL = tempCanvas.toDataURL('image/png');
        setImageData(dataURL);
      };
    };
  }, [canvasRef]);

  return <TextButton className="ps-6 pe-6" onClick={saveCanvas} size="sm" variant="rounded">다 그렸어!</TextButton>;
}

export default SaveButton;
