// src/components/common/Toast.tsx
import type { Toast, NotificationType } from '@/types/notification';

interface ToastProps {
  toast: Toast;
}

const toastBackgroundColors: Record<NotificationType, string> = {
  error: 'bg-red-500',
  success: 'bg-green-500',
  invitation: 'bg-blue-500',
  accept: 'bg-green-500',
  reject: 'bg-yellow-500',
};

function ToastMessage({ toast }: ToastProps): JSX.Element {
  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded shadow-lg text-white min-w-[300px] z-90
      ${toastBackgroundColors[toast.type]}`}
    >
      {toast.message}
    </div>
  );
}

export default ToastMessage;
