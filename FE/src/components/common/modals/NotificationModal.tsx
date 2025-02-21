import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { IconCircleButton } from '../buttons/CircleButton';
import RecentLetterList from '../RecentLetterList';
import '@/components/common/scrollbar.css';

interface NotificationModalProps {
  onClose: () => void;
}

function NotificationModal({ onClose }: NotificationModalProps): JSX.Element {
  return (
    <div
      role="presentation"
      className="fixed top-0 left-0 w-full h-full z-30
      bg-[#00000060]
      flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-1/2 min-h-[85vh] bg-[#FFF08E] border-10 border-tainoi-400
        flex flex-col absolute items-center justify-bottom p-8 rounded-[2vw] overflow-hidden space-y-3"
      >
        <IconCircleButton
          size="xs"
          variant="action"
          className="absolute top-4 right-4 font-semibold"
          onClick={onClose}
          icon={<FontAwesomeIcon icon={faX} size="lg" />}
        />
        <div className="space-x-3 flex w-full text-4xl font-[BMJUA]">
          <FontAwesomeIcon className="text-tainoi-500" icon={faEnvelope} size="lg" />
          <h1>오늘 받은 편지</h1>
        </div>
        <div className="w-full h-[calc(80vh-200px)] overflow-y-scroll customScrollbar yellow">
          <RecentLetterList />
        </div>
      </div>
    </div>
  );
}

export default NotificationModal;
