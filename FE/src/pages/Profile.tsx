import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import TextButton from '@/components/common/buttons/TextButton';
import ProfileImage from '@/components/common/ProfileImage';
import { IconCircleButton } from '@/components/common/buttons/CircleButton';

function Profile(): JSX.Element {
  const MOCK_PROFILE = {
    name: '김과자',
    type: '동화나라 여행자',
    days: 45,
    code: '1234 5678',
  };

  return (
    <div className="w-full h-screen bg-onahau-100 flex items-center justify-center relative">
      <div className="absolute top-6 left-6">
        <IconCircleButton
          size="sm"
          variant="action"
          className=""
          icon={<FontAwesomeIcon icon={faArrowLeft} size="lg" />}
        />
      </div>
      <div className="absolute top-6 right-6">
        <TextButton size="md" variant="gray" className="">계정 변경</TextButton>
      </div>
      <div className="flex absolute items-center justify-center
        min-w-4/5 h-[75vh] rounded-[2vw]
        bg-witch-haze-200
        border-6 border-tainoi-300"
      >
        <div className="flex gap-4 relative">
          <ProfileImage
            src="https://health.chosun.com/site/data/img_dir/2023/07/17/2023071701753_0.jpg"
            size="xl"
          />
          <div>
            <h2 className="text-xl font-bold">{MOCK_PROFILE.type}</h2>
            <h1 className="text-2xl font-bold mt-1">{MOCK_PROFILE.name}</h1>
            <p className="text-sm mt-2">
              여행을 시작한 지 +
              {MOCK_PROFILE.days}
              일
            </p>
            <div className="bg-white rounded-lg px-3 py-1 mt-2 inline-block">
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
