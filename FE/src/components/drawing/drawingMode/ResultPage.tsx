import TextButton, { ButtonSize } from '@/components/common/buttons/TextButton';
import { useEffect, useState } from 'react';
import DialogModal from '@/components/common/modals/DialogModal';
import { useDrawing } from '@/stores/drawing/drawingStore';
import { useFriends } from '@/stores/friendStore';
import { FrameInfo } from '@/types/frame';
import uploadImageToS3 from '../../../utils/drawingS3/drawingUpload';

function ResultPage() {
  const {
    mode,
    setMode,
    template,
    setTemplate,
    setPenColor,
    setIsErasing,
    imageData,
    setImageData,
  } = useDrawing();

  const {
    friend, setFriend, setIsConnected,
  } = useFriends();

  const [buttonSize, setButtonSize] = useState<ButtonSize>('sm');
  const [saveModal, setSaveModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  useEffect(() => {
    const updateSize = () => {
      setButtonSize(window.innerWidth >= 768 ? 'md' : 'sm'); // 768px(md) 기준 변경
    };

    updateSize(); // 초기 실행
    window.addEventListener('resize', updateSize); // 리사이즈 이벤트 리스너 등록

    return () => window.removeEventListener('resize', updateSize); // 클린업
  }, []);

  const onSave = async () => {
    try {
      const drawingResult: FrameInfo = {
        frameTitle: `${mode === 'single' ? '내가 그린' : `${friend ? friend.name : '친구'}와 그린`} ${template ? template.sketchTitle : ''}`,
        frameUrl: imageData,
        frameFileName: '',
        createdAt: '',
      };

      await uploadImageToS3(drawingResult);

      setFriend(null);
      setIsConnected(false);
      setPenColor('black');
      setIsErasing(false);
      setTemplate(null);
      setMode(null);
      setImageData('');
    } catch (error) {
      console.error('Failed to save drawing:', error);
    }
  };

  const onDelete = () => {
    setFriend(null);
    setIsConnected(false);
    setPenColor('black');
    setIsErasing(false);
    setTemplate(null);
    setMode(null);
    setImageData('');
  };

  return (
    <div className="w-full h-full bg-amber-200">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="text-center max-w-[90%]">
          <img
            className="outline-amber-900 outline-8 md:outline-12 max-w-[80%] max-h-[80vh] border-8 md:border-12 border-amber-700 shadow-2xl bg-white mx-auto"
            src={imageData}
            alt={template ? template.sketchTitle : ''}
          />
        </div>
        <div className="text-center mt-[-16px]">
          <p className="bg-amber-400 font-bold md:text-xl p-1 ps-5 pe-5 rounded-md shadow-md">
            {mode === 'single' ? '내가 그린' : `${friend ? friend.name : '친구'}와 그린`}
            {' '}
            {template ? template.sketchTitle : ''}
          </p>
        </div>
        <div className="text-center mt-4 md:mt-10 space-x-4">
          <TextButton size={buttonSize} variant="white" onClick={() => setSaveModal(true)}>액자에 걸어둘래</TextButton>
          <TextButton size={buttonSize} variant="white" onClick={() => setDeleteModal(true)}>그냥 두고 갈래</TextButton>
        </div>
      </div>
      {
        saveModal
          ? (
            <DialogModal
              type="info"
              message1="그림을 액자에 걸었어요!"
              message2="내가 그린 그림은 나의 집에서 다시 볼 수 있어요"
              onConfirm={onSave}
              onClose={onSave}
            />
          )
          : null
      }
      {
        deleteModal
          ? (
            <DialogModal
              type="info"
              message1="그림을 정리했어요!"
              message2="언제든 다시 그릴 수 있어요"
              onConfirm={onDelete}
              onClose={onDelete}
            />
          )
          : null
      }
    </div>
  );
}

export default ResultPage;
