// import { useNavigate } from 'react-router-dom';
import { IconCircleButton } from '@/components/common/buttons/CircleButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useFriends } from '@/stores/friendStore';
import { useEffect } from 'react';
import useToastStore from '@/stores/toastStore';
import CircularTimer from '../Timer';

interface InvitationWaitPageProps {
  message?: string;
  showTimer?: boolean;
  duration?: number;
  onComplete?: () => void;
}

function InvitationWaitPage({
  message = '친구에게 초대장을 보내고 있어요',
  showTimer = true,
  duration = 10,
  onComplete,
}: InvitationWaitPageProps) {
  const { setFriend, setIsConnected } = useFriends();
  const toastStore = useToastStore();

  useEffect(() => {
    if (!showTimer) {
      setTimeout(() => {
        setIsConnected(true);
        if (onComplete) onComplete();
      }, 2000);
    }
  }, [showTimer, setIsConnected, onComplete]);

  const handleTimerComplete = () => {
    toastStore.showToast({
      type: 'reject',
      message: '친구가 지금은 바쁜가 봐요! 다음에 다시 초대해보세요.',
    });
    setFriend(null);
    if (onComplete) onComplete();
  };

  return (
    <div className="w-screen h-screen">
      <div className="fixed top-5 left-5">
        <IconCircleButton
          size="sm"
          variant="action"
          className=""
          onClick={() => setFriend(null)}
          icon={<FontAwesomeIcon icon={faArrowLeft} size="sm" />}
        />
      </div>
      <div className="fixed bottom-0 w-full h-[30%] min-h-20 bg-gradient-to-t from-black to-transparent" />
      <img
        src="/images/loadingImages/invitationImg.webp"
        alt="networkerror"
        className="w-full h-full object-cover object-center"
      />
      <div className="fixed bottom-10 right-10 text-white text-2xl md:text-3xl font-[BMJUA] flex items-center">
        <span className="min-w-[24rem] text-right">{message}</span>
        {showTimer && (
          <div className="ml-5">
            <CircularTimer
              isActive
              duration={duration}
              onComplete={handleTimerComplete}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default InvitationWaitPage;
