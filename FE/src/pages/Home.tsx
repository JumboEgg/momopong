import FriendsModal from '@/components/common/modals/FriendsModal';
import useSocketStore from '@/components/drawing/hooks/useSocketStore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
  const handleNavigation = (path: '/profile' | '/friends' | '/drawing' | '/story' | '/house' | '/test'): void => {
    navigate(path);
  };
  const [hoveredItem, setHoveredItem] = useState<'drawing' | 'story' | 'house' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // 친구목록 모달

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const {
    setConnect,
  } = useSocketStore();
  useEffect(() => {
    setConnect(true);
  }, []);

  return (
    <div
      className="min-h-screen p-2 flex items-center justify-center"
      style={{
        backgroundImage: 'url(/images/mainBackground.png)',
        backgroundSize: '100% 100%',
      }}
    >
      <button
        type="button"
        onClick={() => handleNavigation('/profile')}
        className="fixed top-5 left-5 flex flex-col items-center bg-transparent border-0 p-0 m-0"
      >
        <img
          src="/images/profileicon.png"
          alt="프로필"
          className="w-[5vw] min-w-10 object-contain"
        />
        <p className="text-xl mt-0.5">프로필</p>
      </button>

      <button
        type="button"
        onClick={handleOpenModal}
        className="fixed top-5 right-5 flex flex-col items-center bg-transparent border-0 p-0 m-0"
      >
        <img
          src="/images/friendsicon.png"
          alt="친구목록"
          className="w-[5vw] min-w-10 object-contain"
        />
        <p className="text-xl mt-0.5">친구목록</p>
      </button>

      {isModalOpen && (
        <FriendsModal
          onClose={handleCloseModal}
        />
      )}

      {/* Main Navigation Icons */}
      <div className="flex justify-center items-center gap-12 font-[BMJUA] text-3xl">
        <button
          type="button"
          onClick={() => handleNavigation('/drawing')}
          onMouseEnter={() => setHoveredItem('drawing')}
          onMouseLeave={() => setHoveredItem(null)}
          className="flex flex-col items-center bg-transparent border-0 p-0 m-0 transition-all duration-300 translate-y-[10vh]"
          style={{ transform: `scale(${hoveredItem === 'drawing' ? 1.1 : 1})` }}
        >
          <img
            src="/images/crayonicon.png"
            alt="그림그리기"
            className="w-[20vw] object-contain"
          />
          <p className="mt-5">그림그리기</p>
        </button>

        <button
          type="button"
          onClick={() => handleNavigation('/story')}
          onMouseEnter={() => setHoveredItem('story')}
          onMouseLeave={() => setHoveredItem(null)}
          className="flex flex-col items-center bg-transparent border-0 p-0 m-0 transition-all duration-300"
          style={{ transform: `scale(${hoveredItem === 'story' ? 1.1 : 1})` }}
        >
          <img
            src="/images/bookicon.png"
            alt="동화읽기"
            className="w-[25vw] object-contain"
          />
          <p className="mt-0.5">동화읽기</p>
        </button>

        <button
          type="button"
          onClick={() => handleNavigation('/house')}
          onMouseEnter={() => setHoveredItem('house')}
          onMouseLeave={() => setHoveredItem(null)}
          className="flex flex-col items-center bg-transparent border-0 p-0 m-0 transition-all duration-300 translate-y-[10vh]"
          style={{ transform: `scale(${hoveredItem === 'house' ? 1.1 : 1})` }}
        >
          <img
            src="/images/houseicon.png"
            alt="나의집"
            className="w-[20vw] object-contain"
          />
          <p className="mt-5">나의집</p>
        </button>
        <button
          type="button"
          onClick={() => handleNavigation('/test')}
          className="cursor-pointer flex flex-col items-center"
        >
          <p className="text-center text-xs mt-1 border-2">테스트</p>
        </button>
      </div>
    </div>
  );
}

export default HomePage;
