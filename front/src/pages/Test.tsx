/*
  컴포넌트 테스트를 위해 사용하는 페이지입니다.
  필요시 참고하기 위해 남겨두었으니 말없이 지우지 말아주세요!
*/
import { useState } from 'react';
import ButtonDemo from '@/components/common/buttons/ButtonDemo';
import TextButton from '@/components/common/buttons/TextButton';
import ParentAuthModal from '@/components/common/modals/ParentAuthModal';
// import DialogModal from '@/components/common/modals/DialogModal';
import Timer from '@/components/common/Timer';

function Test() {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      컴포넌트 테스트 페이지
      <ButtonDemo />
      {/* type="button" 추가 */}
      <button
        type="button"
        onClick={() => setIsTimerActive(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        타이머 테스트
      </button>

      <Timer
        isActive={isTimerActive}
        duration={20}
        onComplete={() => {
          setIsTimerActive(false);
        }}
      />
      {/* 모달 열기 버튼 */}
      <TextButton
        size="md"
        variant="white"
        className=""
        onClick={handleOpenModal}
      >
        모달 열기
      </TextButton>
      {/* 키패드 모달 테스트 */}
      {isModalOpen && (
        <ParentAuthModal onClose={handleCloseModal} />
      )}

      {/* <DialogModal /> */}
    </div>
  );
}
export default Test;
