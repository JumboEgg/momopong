// 초대 및 불가여부 확인하는 Dialog 모달 컴포넌트
// 추후 초대 로직 만들어서 추가하면 됩니다

import TextButton from '@/components/common/buttons/TextButton';

interface DialogModalProps {
  type: 'confirm' | 'info'
  message1: string;
  message2: string;
  onConfirm: () => void;
  onClose: () => void;
}

function DialogModal({
  type, // type으로 confirm을 사용할시 버튼 표시, info로 사용할시 버튼 없이 메시지만 표시
  message1,
  message2,
  onConfirm,
  onClose,
}: DialogModalProps): JSX.Element {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full z-45
      bg-[#00000060]
      flex items-center justify-center"
    >
      <div className="w-[500px] min-h-[350px] bg-[#FFF08E] border-10 border-tainoi-400
        flex flex-col relative items-center justify-between p-8 rounded-[2vw] overflow-hidden"
      >
        {/* 텍스트 중앙 정렬 위해 div 추가 */}
        <div className="flex-grow flex flex-col items-center justify-center font-[BMJUA]">
          <div className="flex flex-col gap-1">
            <p className="text-center text-3xl">{message1}</p>
            <p className="text-center text-3xl">{message2}</p>
          </div>
        </div>

        {type === 'confirm' ? (
          <div className="flex gap-4">
            <TextButton
              size="md"
              variant="rounded"
              onClick={handleConfirm}
            >
              같이 하자
            </TextButton>
            <TextButton
              size="md"
              variant="rounded"
              onClick={onClose}
            >
              다음에 할게
            </TextButton>
          </div>
        ) : (
          <TextButton
            size="md"
            variant="rounded"
            onClick={onClose}
          >
            닫기
          </TextButton>
        )}
      </div>
    </div>
  );
}

export default DialogModal;
