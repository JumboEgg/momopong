import { useState } from 'react';
import TextButton from '@/components/common/buttons/TextButton';
import ParentAuthModal from '@/components/common/modals/ParentAuthModal';
import SubAccountGrid from './SubAccountGrid';

function SubAccountPage(): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false); // 키패드 모달 상태

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-full h-screen bg-onahau-100 flex items-center justify-center relative">
      <div className="absolute top-6 right-6">
        <TextButton
          size="md"
          variant="gray"
          className=""
          onClick={handleOpenModal}
        >
          보호자 계정
        </TextButton>
        {isModalOpen && (
          <ParentAuthModal
            onClose={handleCloseModal}
          />
        )}
      </div>
      <div>
        <SubAccountGrid />
      </div>
    </div>
  );
}

export default SubAccountPage;
