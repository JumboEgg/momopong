import React from 'react';

type NoticeType = 'invite' | 'system';

// 각 타입의 공통 요소
interface BaseNotification {
  id: number;
  image: string;
  timestamp: string;
}

// invite일때 받아올 요소
interface InviteNotification extends BaseNotification {
  type: 'invite';
  senderName: string;
  title: string;
}

// system 메시지일때 받아올 요소
interface SystemNotification extends BaseNotification {
  type: 'system';
  characterName: string; // 동화 속 등장인물 이름
}

type NotificationData = InviteNotification | SystemNotification;

interface NotificationItemProps {
  type: NoticeType;
  data: NotificationData;
  onClick: () => void;
}

// Mock Data
export const mockNotifications: NotificationData[] = [
  {
    id: 1,
    type: 'invite',
    senderName: '인어공주',
    title: '인어공주',
    image: '/api/placeholder/40/40',
    timestamp: '2024-01-30T10:00:00Z',
  },
  {
    id: 2,
    type: 'system',
    characterName: '그레텔',
    image: '/api/placeholder/40/40',
    timestamp: '2024-01-30T09:00:00Z',
  },
  {
    id: 3,
    type: 'invite',
    senderName: '백설공주',
    title: '백설공주',
    image: '/api/placeholder/40/40',
    timestamp: '2024-01-30T08:00:00Z',
  },
  {
    id: 4,
    type: 'system',
    characterName: '헨젤',
    image: '/api/placeholder/40/40',
    timestamp: '2024-01-30T07:00:00Z',
  },
];

function NotificationItem({
  type,
  data,
  onClick,
}: NotificationItemProps) {
  const isInvite = type === 'invite';

  const getSystemMessage = (userName: string) => `${userName}(이)가 편지를 보냈어요. 집에서 확인할 수 있어요!`;

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
        <p className="text-sm text-gray-900">
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
            <span>{getSystemMessage((data as SystemNotification).characterName)}</span>
          )}
        </p>
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

// export default NotificationItem;

// Example
function NotificationList() {
  return (
    <div className="max-w-md mx-auto border rounded-lg overflow-hidden">
      {mockNotifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          type={notification.type}
          data={notification}
          onClick={() => console.log('Clicked notification:', notification.id)}
        />
      ))}
    </div>
  );
}

export default NotificationList;
