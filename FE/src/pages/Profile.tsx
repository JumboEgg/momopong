import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import useSubAccountStore from '@/stores/subAccountStore';
import TextButton from '@/components/common/buttons/TextButton';
import ProfileImage, { ProfileImgSize } from '@/components/common/ProfileImage';
import { IconCircleButton } from '@/components/common/buttons/CircleButton';

function Profile(): JSX.Element {
  const navigate = useNavigate();
  const { selectedAccount, logoutSubAccount } = useSubAccountStore();
  const [imgSize, setImgSize] = useState<ProfileImgSize>('xl');

  const handleAccountChange = async () => {
    try {
      logoutSubAccount();
      navigate('/parents/:parent_id/children');
    } catch (error) {
      console.error('계정 변경 중 오류 발생:', error);
      navigate('/parents/:parent_id/children');
    }
  };

  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      setImgSize('xl');
    } else if (window.innerWidth >= 768) {
      setImgSize('lg');
    } else {
      setImgSize('md');
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-onahau-100 flex items-center justify-center p-4 font-[BMJUA]">
      {/* Navigation Buttons - Responsive positioning */}
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6">
        <IconCircleButton
          size="sm"
          variant="action"
          icon={<FontAwesomeIcon icon={faArrowLeft} size="lg" />}
          onClick={() => navigate('/home')}
        />
      </div>
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6">
        <TextButton
          size="md"
          variant="gray"
          onClick={handleAccountChange}
        >
          계정 변경
        </TextButton>
      </div>

      {/* Main Content Container */}
      <div className="w-[85%] max-w-7xl mx-auto my-16 sm:my-0
                    p-6 sm:p-8 md:p-12
                    rounded-2xl sm:rounded-[2vw]
                    bg-witch-haze-200
                    border-4 sm:border-6 border-tainoi-300"
      >

        {/* Profile Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Profile Image */}
          <div className="flex justify-center md:justify-start">
            <ProfileImage
              key={selectedAccount?.profile}
              src={selectedAccount?.profile}
              alt="프로필"
              size={imgSize}
              shape="square"
            />
          </div>

          {/* Profile Information */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl">
              동화나라 여행자
            </h2>
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold">
              {selectedAccount?.name}
            </h1>
            <p className="text-sm sm:text-base md:text-xl">
              여행을 시작한 지 +
              {selectedAccount?.daysSinceStart}
              일
            </p>
            <div className="text-base sm:text-lg md:text-2xl
                          bg-orange-300 rounded-lg
                          px-4 sm:px-5
                          py-2 sm:py-3
                          mt-2 sm:mt-4"
            >
              나의 코드:
              {' '}
              {selectedAccount?.code}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
