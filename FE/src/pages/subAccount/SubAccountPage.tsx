import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextButton from '@/components/common/buttons/TextButton';
import ParentAuthModal from '@/components/common/modals/ParentAuthModal';
import useAuthStore from '@/stores/authStore';
import SubAccountGrid from './SubAccountGrid';

function SubAccountPage(): React.ReactElement | null {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddAccount = () => {
    const parentId = user?.parentId;
    navigate(`/parents/${parentId}/children/signup`);
  };

  useEffect(() => {
    if (!user?.parentId) {
      navigate('/parents/login');
    }
  }, [user, navigate]);

  if (!user?.parentId) {
    return null;
  }

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
          onClick={handleOpenModal}
        >
          보호자 계정
        </TextButton>
        {isModalOpen && <ParentAuthModal onClose={handleCloseModal} />}
      </div>
      <div className="max-w-6xl mx-auto">
        <SubAccountGrid onAdd={handleAddAccount} />
      </div>
    </div>
  );
}

export default SubAccountPage;
