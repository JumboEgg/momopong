import {
  NoticeType,
  NotificationData,
  InviteNotification,
  SystemNotification,
} from '@/stores/notificationStore';

interface NotificationItemProps {
  type: NoticeType;
  data: NotificationData;
  onClick: () => void;
}

function NotificationItem({
  type,
  data,
  onClick,
}: NotificationItemProps) {
  // data가 없으면 일찍 반환
  if (!data) return null;
  const isInvite = type === 'invite';

  const FIXED_MESSAGES = {
    SENT_LETTER: '(이)가 편지를 보냈어요.',
    CHECK_AT_HOME: '집에서 확인할 수 있어요!',
  } as const;

  return (
    <button
      type="button"
      className={`w-full flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
        isInvite ? 'bg-white' : 'bg-orange-100'
      }`}
      onClick={onClick}
      aria-label={isInvite ? '초대 알림' : '시스템 알림'}
    >
      <div className="flex-shrink-0">
        <img
          src={data.image}
          alt={isInvite ? 'User Profile' : 'Character Profile'}
          className="w-10 h-10 rounded-full"
        />
      </div>

      <div className="ml-4 flex-grow">
        <div className="text-sm text-gray-900">
          {isInvite ? (
            <span>
              <strong>{(data as InviteNotification).senderName}</strong>
              와 함께
              {' '}
              <strong>{(data as InviteNotification).title}</strong>
              {' '}
              읽어요
            </span>
          ) : (
            <div className="flex flex-col gap-1">
              <p>
                {(data as SystemNotification).characterName}
                {FIXED_MESSAGES.SENT_LETTER}
              </p>
              <p>{FIXED_MESSAGES.CHECK_AT_HOME}</p>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
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
