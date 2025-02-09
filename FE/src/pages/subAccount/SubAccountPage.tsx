import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import TextButton from '@/components/common/buttons/TextButton';
import ParentAuthModal from '@/components/common/modals/ParentAuthModal';
import useAuthStore from '@/stores/authStore';
import SubAccountGrid from './SubAccountGrid';
import SubAccountForm from './SubAccountForm';

function SubAccountPage(): React.ReactElement | null {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleAddAccount = () => {
    navigate('/children/signup');
  };

  // 부모 계정 정보가 없으면 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!user?.parentId) {
      navigate('/parents/login');
    }
  }, [user, navigate]);

  if (!user?.parentId) {
    return null; // 또는 로딩 상태 표시
  }

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
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
        <Routes>
          <Route
            path="/"
            element={<SubAccountGrid onAdd={handleAddAccount} />}
          />
          <Route
            path="/create"
            element={<SubAccountForm />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default SubAccountPage;
