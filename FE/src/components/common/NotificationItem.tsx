import {
  NotificationData,
  InviteNotification,
} from '@/stores/notificationStore';

interface NotificationItemProps {
  data: NotificationData;
  onClick: () => void;
}

function NotificationItem({
  data,
  onClick,
}: NotificationItemProps) {
  if (!data) return null;

  return (
    <button
      type="button"
      className="w-full flex items-center my-1 p-3 cursor-pointer bg-amber-200 rounded-2xl"
      onClick={onClick}
      aria-label={`${(data as InviteNotification).senderName}의 초대`}
    >
      <div className="flex-shrink-0">
        <img
          src={data.image}
          alt="User Profile"
          className="w-10 h-10 rounded-full"
        />
      </div>

      <div className="ml-4 flex-grow">
        <div className="text-gray-900 text-start">
          <span>
            <strong>{(data as InviteNotification).senderName}</strong>
            와 함께
            {' '}
            <strong>{(data as InviteNotification).title}</strong>
            {' '}
            읽어요
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1 text-end">
          {new Date(data.timestamp).toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </button>
  );
}

export default NotificationItem;
