import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
// import useSubAccountStore from '@/stores/subAccountStore';
import TextButton from '@/components/common/buttons/TextButton';
import ParentAuthModal from '@/components/common/modals/ParentAuthModal';
import SubAccountGrid from './SubAccountGrid';
// import SubAccountForm from './SubAccountForm';

function SubAccountPage(): JSX.Element {
  const navigate = useNavigate();
  // const { isEditing } = useSubAccountStore();

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
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
          <Routes>
            <Route
              path="/"
              element={<SubAccountGrid onAdd={() => navigate('/create')} />}
            />
            {/* 폼 prop 수정 예정 */}
            {/* <Route
              path="/create"
              element={<SubAccountForm mode="create" />}
            /> */}
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default SubAccountPage;
