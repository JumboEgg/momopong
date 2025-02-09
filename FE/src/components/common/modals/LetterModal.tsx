// DrawingModal.tsx
import TextButton from '@/components/common/buttons/TextButton';
import { LetterInfo } from '@/types/letter';

interface LetterModalProps {
    childName: string;
  data: LetterInfo;
  onClose: () => void;
}

function LetterModal({
    childName,
  data,
  onClose,
}: LetterModalProps): JSX.Element {
  const onSave = () => {
    // TODO : 저장 버튼 클릭 시 오디오 저장
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
            <p>
              {childName}
              (이)가 보낸 내용
            </p>
            <p className="text-center text-3xl break-words">{data.content}</p>
            <p>
              {data.bookTitle}
              의
              {' '}
              {data.role}
              (이)가 보낸 답장
            </p>
            <p>{data.reply}</p>
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

export default LetterModal;
