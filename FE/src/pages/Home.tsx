import FriendsModal from '@/components/common/modals/FriendsModal';
import ProfileImage from '@/components/common/ProfileImage';
import useSubAccountStore from '@/stores/subAccountStore';
import { saveFCMToken } from '@/api/storyApi';
import { HandleAllowNotification, messaging } from '@/services/firebaseService';
import { getToken } from 'firebase/messaging';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundMusic from '@/components/BackgroundMusic';
import NotificationModal from '@/components/common/modals/NotificationModal';
import useRecentLetterStore from '@/stores/letter/recentLetterStore';
import { tokenService, checkTokenRegistration } from '@/services/tokenService';
import { useRoleStore } from '@/stores/roleStore';
import { useSketchList } from '@/stores/drawing/sketchListStore';

function HomePage() {
  const navigate = useNavigate();
  const { selectedAccount, updateChildStatus } = useSubAccountStore();
  const { setRecentLetterList } = useRecentLetterStore();
  const { setSketchList } = useSketchList();
  const handleNavigation = (path: '/profile' | '/friends' | '/drawing' | '/story' | '/house'): void => {
    navigate(path);
  };
  const clearRoles = useRoleStore((state) => state.clearRoles); // clearRoles 함수

  const [hoveredItem, setHoveredItem] = useState<'drawing' | 'story' | 'house' | 'post' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // 친구목록 모달
  const [isLettersModalOpen, setIsLettersModalOpen] = useState<boolean>(false);

  // updateChildStatus를 메모이제이션
  const updateStatus = useCallback(() => {
    if (selectedAccount) {
      updateChildStatus();
    }
  }, [selectedAccount, updateChildStatus]);

  // 상태 초기화는 마운트시 한 번만 실행
  useEffect(() => {
    updateStatus();
  }, [updateStatus]);

  useEffect(() => {
    const registerFCMToken = async () => {
      try {
        const currentChildId = tokenService.getCurrentChildId();
        if (!currentChildId) return;

        const isTokenRegistered = await checkTokenRegistration(currentChildId);
        if (isTokenRegistered) return;

        await HandleAllowNotification();
        const fcmToken = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });

        if (fcmToken) {
          await saveFCMToken(currentChildId, fcmToken);
        }
      } catch (err) {
        console.error('FCM 토큰 등록 실패:', err);
      }
    };

    registerFCMToken();
    clearRoles();
  }, []);

  // useEffect(() => {
  //   if (!selectedAccount) {
  //     return undefined;
  //   }

  //   // 초기 상태 업데이트
  //   updateChildStatus();

  //   // 주기적으로 상태 업데이트 (선택사항)
  //   const intervalId = setInterval(() => {
  //     updateChildStatus();
  //   }, 60000); // 1분마다 업데이트

  //   return () => clearInterval(intervalId);
  // }, [selectedAccount, updateChildStatus]);

  useEffect(() => {
    setRecentLetterList();
    setSketchList();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      className="min-h-screen p-2 flex items-center justify-center"
      style={{
        backgroundImage: 'url(/images/mainBackground.png)',
        backgroundSize: '100% 100%',
      }}
    >
      <BackgroundMusic />
      <button
        type="button"
        onClick={() => handleNavigation('/profile')}
        className="fixed top-2 md:top-5 left-2 md:left-5 flex flex-col items-center bg-transparent border-0 p-0 m-0"
      >
        <ProfileImage
          key={selectedAccount?.profile} // URL이 바뀔 때마다 컴포넌트 리렌더링
          src={selectedAccount?.profile}
          alt="프로필"
          size="sm"
          shape="circle"
        />
        <p className="text-sm font-[GeekbleMalang2WOFF2] md:text-xl mt-0.5">{selectedAccount?.name}</p>
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
        <p className="text-sm font-[GeekbleMalang2WOFF2] md:text-xl mt-0.5">친구목록</p>
      </button>

      {isModalOpen && (
        <FriendsModal
          onClose={handleCloseModal}
        />
      )}

      {/* Main Navigation Icons */}
      <div className="flex justify-center items-center gap-12 font-[BMJUA] text-xl md:text-3xl">
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
          <p className="mt-1 md:mt-5">그림그리기</p>
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
          <p className="-mt-3.5 md:mt-0.5">동화읽기</p>
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
          <p className="mt-1 md:mt-5">나의집</p>
        </button>
      </div>

      <button
        type="button"
        onClick={() => setIsLettersModalOpen(true)}
        onMouseEnter={() => setHoveredItem('post')}
        onMouseLeave={() => setHoveredItem(null)}
        className="fixed flex flex-col items-center bg-transparent border-0 p-0 m-0 transition-all duration-300
        translate-x-[15vw] translate-y-[15vh]"
        style={{ transform: `scale(${hoveredItem === 'post' ? 1.1 : 1})` }}
      >
        <img
          src="/images/icons/notification.png"
          alt="우편함"
          className="w-[10vw]"
        />
      </button>

      {isLettersModalOpen && (
        <NotificationModal
          onClose={() => setIsLettersModalOpen(false)}
        />
      )}
    </div>
  );
}

export default HomePage;
