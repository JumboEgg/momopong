// components/common/multiplayPages/LoadingPage.tsx
import { IconCircleButton } from '@/components/common/buttons/CircleButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useFriends } from '@/stores/friendStore';
import { useEffect } from 'react';

interface LoadingPageProps {
  onLoadingComplete?: () => void;
  duration?: number;
}

function LoadingPage({ onLoadingComplete, duration = 2000 }: LoadingPageProps) {
  const { setFriend } = useFriends();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onLoadingComplete) {
        onLoadingComplete();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [onLoadingComplete, duration]);

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
        src="/images/loadingImages/loadingImg.webp" // 적절한 로딩 이미지 필요
        alt="loading"
        className="w-full h-full object-cover object-center"
      />
      <div className="fixed bottom-10 right-10 text-white text-2xl md:text-3xl font-[BMJUA]">
        친구와 만나러 가고 있어요...
      </div>
    </div>
  );
}

export default LoadingPage;
