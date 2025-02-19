import { IconCircleButton } from '@/components/common/buttons/CircleButton';
import { useBookContent } from '@/stores/book/bookContentStore';
import { useRoleStore } from '@/stores/roleStore';
import useSubAccountStore from '@/stores/subAccountStore';
import AudioRecorderSTT from '@/utils/letterS3/AudioRecorderSTT';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

function LetterPage() {
  const navigate = useNavigate();
  const { bookContent } = useBookContent();
  const { role2UserId } = useRoleStore();

  const myId = useSubAccountStore.getState().selectedAccount?.childId;
  const myRole = role2UserId === myId ? bookContent?.role2 : bookContent?.role1;
  return (
    <div className="w-screen h-screen bg-pink-200 relative">
      <IconCircleButton
        size="sm"
        variant="action"
        className="fixed top-5 left-5 z-10"
        onClick={() => navigate('/home')}
        icon={<FontAwesomeIcon icon={faArrowLeft} size="sm" />}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
        <div className="text-xl sm:text-2xl md:text-3xl font-[BMJUA]">
          {myRole}
          (이)에게 하고 싶은 말을 남겨주세요
        </div>
        <img
          src={bookContent?.pages[bookContent.pages.length - 1].pagePath}
          alt="내가 맡은 등장인물"
          className="max-w-[80vw] max-h-[80vh] object-contain rounded-2xl shadow-xl"
        />
      </div>
      <div className="absolute bottom-10 left-0 w-full flex justify-center">
        <AudioRecorderSTT />
      </div>
    </div>
  );
}

export default LetterPage;
