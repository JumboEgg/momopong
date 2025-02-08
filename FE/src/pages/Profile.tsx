import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
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
      // 에러가 발생해도 계정 선택 페이지로 이동
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
    <div className="w-full h-screen bg-onahau-100 flex items-center justify-center relative font-[BMJUA]">
      <div className="absolute top-6 left-6">
        <IconCircleButton
          size="sm"
          variant="action"
          className=""
          icon={<FontAwesomeIcon icon={faArrowLeft} size="lg" />}
          onClick={() => navigate('/home')}
        />
      </div>
      <div className="absolute top-6 right-6">
        <TextButton
          size="md"
          variant="gray"
          onClick={handleAccountChange}
        >
          계정 변경
        </TextButton>
      </div>
      <div className="flex flex-col absolute items-center justify-center
        w-4/5 min-w-2xl max-w-4xl h-[75vh] rounded-[2vw]
        bg-witch-haze-200
        border-6 border-tainoi-300"
      >
        <div className="columns-2 gap-4 relative">
          <ProfileImage
            key={selectedAccount?.profile} // URL이 바뀔 때마다 컴포넌트 리렌더링
            src={selectedAccount?.profile}
            alt="프로필"
            size={imgSize}
            shape="square"
            className="left-10"
          />
          <div className="w-full h-full flex flex-col items-center justify-center">
            <h2 className="text-xl md:text-2xl">동화나라 여행자</h2>
            <h1 className="text-2xl md:text-4xl mt-1 md:mt-2">{selectedAccount?.name}</h1>
            <p className="text-sm md:text-xl mt-2 md:mt-5">
              여행을 시작한 지 +
              {selectedAccount?.daysSinceStart}
              일
            </p>
            <div className="text-xl md:text-2xl bg-orange-300 rounded-lg px-3 md:px-5 py-1 md:py-3 mt-2 md:mt-4 inline-block">
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
