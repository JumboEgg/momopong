import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import NotificationList from '@/components/common/NotificationItem';

function NotificationModal(): JSX.Element {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full z-30
      bg-[#00000060]
      flex items-center justify-center"
    >
      <div className="w-1/2 min-h-[85vh] bg-[#FFF08E] border-10 border-tainoi-400
        flex flex-col absolute items-center justify-between p-8 rounded-[2vw] overflow-hidden"
      >
        <div className="space-x-3 absolute flex items-center top-13 left-13 text-4xl font-[BMJUA]">
          <FontAwesomeIcon className="text-tainoi-500" icon={faEnvelope} size="lg" />
          <h1>받은 편지</h1>
        </div>
        <div className="">
          <NotificationList />
        </div>
      </div>
    </div>
  );
}

export default NotificationModal;
