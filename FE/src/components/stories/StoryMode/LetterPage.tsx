import { IconCircleButton } from '@/components/common/buttons/CircleButton';
import AudioRecorderSTT from '@/utils/letterS3/AudioRecorderSTT';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

function LetterPage() {
  const navigate = useNavigate();
  return (
    <div className="w-screen h-screen bg-pink-200 relative">
      <IconCircleButton
        size="sm"
        variant="action"
        className="fixed top-5 left-5"
        onClick={() => navigate('/home')}
        icon={<FontAwesomeIcon icon={faArrowLeft} size="sm" />}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src="/images/bookcover/cover_theredridinghood.webp"
          alt="내가 맡은 등장인물"
          className="max-w-[80vw] max-h-[80vh] object-contain"
        />
      </div>
      <div className="absolute bottom-10 left-0 w-full flex justify-center">
        <AudioRecorderSTT />
      </div>
    </div>
  );
}

export default LetterPage;
