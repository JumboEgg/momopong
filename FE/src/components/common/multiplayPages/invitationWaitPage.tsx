// import { useNavigate } from 'react-router-dom';
import { IconCircleButton } from '@/components/common/buttons/CircleButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useFriends } from '@/stores/friendStore';
import { useEffect } from 'react';
import CircularTimer from '../Timer';

function InvitationWaitPage() {
  const {
    setFriend, setIsConnected,
  } = useFriends();

  useEffect(() => {
    setTimeout(() => {
      setIsConnected(true);
    }, 2000);
  });

  return (
    <div className="w-full h-full">
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
      <div className="fixed bottom-10 right-10 text-white text-2xl md:text-3xl font-[BMJUA] flex space-x-5 justify-center items-center">
        친구에게 초대장을 보내고 있어요
        <CircularTimer isActive duration={10} onComplete={() => setFriend(null)} />
      </div>
    </div>
  );
}

export default InvitationWaitPage;
