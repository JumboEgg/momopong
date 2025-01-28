// 초대 및 불가여부 확인하는 Dialog 모달 컴포넌트

import TextButton from '@/components/common/buttons/TextButton';

// type DialogType = 'confirm' | 'info';

// interface DialogModalProps {
//   type: DialogType;
//   message: string;
//   onConfirm?: () => void;
//   onClose: () => void;
// }

function DialogModal({ onClose }: DialogModalProps) : JSX.Element {
  const handleClose = () => {
    onClose();
  };
  return (
    <div
      className="fixed top-0 left-0 w-full h-full z-45
      bg-[#00000060]
      flex items-center justify-center"
    >
      <div className="w-[500px] min-h-[350px] bg-[#FFF08E] border-10 border-white
        flex relative items-center justify-around p-4 rounded-[2vw] overflow-hidden"
      >
        <TextButton
          size="sm"
          variant="rounded"
          className="absolute top-4 left-4 z-40"
          onClick={handleClose}
        >
          같이 할래
        </TextButton>

      </div>
    </div>
  );
}

export default DialogModal;
