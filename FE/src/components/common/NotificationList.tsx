// components/NotificationList.tsx
import { useEffect } from 'react';
import { useNotificationStore } from '@/stores/notificationStore';
import NotificationItem from './NotificationItem';

function NotificationList() {
  const {
    notifications,
    isLoading,
    hasError,
    fetchNotifications,
    markAsRead,
  } = useNotificationStore();

  // fetchNotifications를 의존성 배열에 추가
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  if (isLoading) return <div>로딩중...</div>;
  if (hasError) return <div>알림을 불러오는데 실패했습니다.</div>;

  return (
    <div className="max-w-md mx-auto border rounded-lg overflow-hidden">
      {!notifications || notifications.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          알림이 없습니다
        </div>
      ) : (
        notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            type={notification.type}
            data={notification}
            onClick={() => markAsRead(notification.id)}
          />
        ))
      )}
    </div>
  );
}

export default NotificationList;
