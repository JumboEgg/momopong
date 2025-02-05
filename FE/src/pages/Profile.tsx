import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import TextButton from '@/components/common/buttons/TextButton';
import ProfileImage, { ProfileImgSize } from '@/components/common/ProfileImage';
import { IconCircleButton } from '@/components/common/buttons/CircleButton';

function Profile(): JSX.Element {
  const navigate = useNavigate();
  const MOCK_PROFILE = {
    name: '김과자',
    type: '동화나라 여행자',
    days: 45,
    code: '1234 5678',
  };

  const [imgSize, setImgSize] = useState<ProfileImgSize>('xl');
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
          onClick={() => navigate('/parents/:parent_id/children')}
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
            src="https://health.chosun.com/site/data/img_dir/2023/07/17/2023071701753_0.jpg"
            size={imgSize}
            shape="square"
          />
          <div className="w-full h-full flex flex-col items-center justify-center">
            <h2 className="text-xl md:text-2xl">{MOCK_PROFILE.type}</h2>
            <h1 className="text-2xl md:text-4xl mt-1 md:mt-2">{MOCK_PROFILE.name}</h1>
            <p className="text-sm md:text-xl mt-2 md:mt-5">
              여행을 시작한 지 +
              {MOCK_PROFILE.days}
              일
            </p>
            <div className="text-xl md:text-2xl bg-orange-300 rounded-lg px-3 md:px-5 py-1 md:py-3 mt-2 md:mt-4 inline-block">
              나의 코드:
              {' '}
              {MOCK_PROFILE.code}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Profile;
