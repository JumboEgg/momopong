/*
  컴포넌트 테스트를 위해 사용하는 페이지입니다.
  필요시 참고하기 위해 남겨두었으니 말없이 지우지 말아주세요!
*/
import { useState } from 'react';
import ButtonDemo from '@/components/common/buttons/ButtonDemo';
import TextButton from '@/components/common/buttons/TextButton';
// import ParentAuthModal from '@/components/common/modals/ParentAuthModal';
import DialogModal from '@/components/common/modals/DialogModal';
// import NotificationModal from '@/components/common/modals/NotificationModal';
// import FriendsModal from '@/components/common/modals/FriendsModal';
import Timer from '@/components/common/Timer';
import PopText from '@/components/common/PopText';

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
        <DialogModal
          type="confirm"
          message1="시간이 초과되어"
          message2="더 이상 사용할 수 없는 초대장이에요"
          onClose={handleCloseModal}
          onConfirm={() => null}
        />
      )}
      {/* <NotificationModal /> */}
      {/* <FriendsModal /> */}
      <PopText
        strokeWidth={25}
        strokeColor="black"
        fontSize="6xl"
        className="font-[BMJUA] text-lavender-rose-400 text-8xl"
      >
        신데렐라
      </PopText>
    </div>
  );
}
export default Test;
