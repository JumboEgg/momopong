// DrawingModal.tsx
import TextButton from '@/components/common/buttons/TextButton';
import { FrameInfo } from '@/types/frame';

interface DrawingModalProps {
  data: FrameInfo;
  onClose: () => void;
}

function DrawingModal({
  data,
  onClose,
}: DrawingModalProps): JSX.Element {
  const handleConvert = () => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = data.frameUrl;

    img.onload = () => {
      // Canvas 생성
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Canvas 크기 설정 (이미지 크기와 동일하게)
      canvas.width = img.width;
      canvas.height = img.height;

      if (!ctx) return;

      // 이미지 그리기
      ctx?.drawImage(img, 0, 0);

      // 변환된 이미지 데이터 URL 생성 (JPG 또는 PNG)
      const convertedDataUrl = canvas.toDataURL('image/png');

      // a 태그를 사용하여 다운로드 링크 생성
      const link = document.createElement('a');
      link.href = convertedDataUrl;
      link.download = data.frameTitle; // 저장할 파일 이름 지정
      link.click(); // 다운로드 실행
    };
  };

  const onSave = () => {
    handleConvert();
    onClose();
  };

  return (
    <div
      role="presentation"
      className="fixed top-0 left-0 w-full h-full z-30 bg-black/60 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-[500px] min-h-[350px] bg-[#FFF08E] border-8 border-[#ffa500]
        flex flex-col relative items-center justify-between p-8 rounded-3xl overflow-hidden"
      >
        <div className="flex-grow flex flex-col items-center justify-center font-[BMJUA] w-full">
          <div className="flex flex-col gap-4 w-full">
            <img
              src={data.frameUrl}
              alt={data.frameTitle}
              className="w-full h-auto rounded-xl"
            />
            <p className="text-center text-3xl break-words">{data.frameTitle}</p>
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <TextButton
            size="md"
            variant="rounded"
            onClick={onSave}
          >
            저장하기
          </TextButton>
          <TextButton
            size="md"
            variant="rounded"
            onClick={onClose}
          >
            닫기
          </TextButton>
        </div>
      </div>
    </div>
  );
}

export default DrawingModal;
