import React, { useState } from 'react';

interface Toast {
  type: 'error' | 'success' | 'invitation' | 'accept' | 'reject';
  message: string | React.ReactNode;
}

interface Invitation {
  inviterId: string;
  inviterName: string;
  inviteeId: string;
  inviteeName: string;
  bookId: string;
  bookTitle: string;
}

const receivePushEvent: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [toast, setToast] = useState<{
    type: Toast['type'];
    message: string | React.ReactNode;
    data?: Invitation;
  } | null>(null);

  const showToast = (message: string, type: Toast['type'], data?: Invitation) => {
    setToast({ type, message, data });
    setTimeout(() => setToast(null), type === 'invitation' ? 10000 : 3000);
  };

  const handleResponse = async (accept: boolean) => {
    if (!toast?.data) return;

    try {
      if (accept) {
        showToast('초대를 수락했습니다.', 'accept');
      } else {
        showToast('초대를 거절했습니다.', 'reject');
      }
    } catch (error) {
      showToast('응답 전송에 실패했습니다.', 'error');
    }
  };

  const toastBackgroundColors: Record<Toast['type'], string> = {
  error: 'bg-red-500',
  success: 'bg-green-500',
  invitation: 'bg-blue-600',
  accept: 'bg-green-500',
  reject: 'bg-yellow-500',
  };

  return (
    <div className="p-4 bg-white rounded shadow relative">
      <div className="mb-4">
        <input
          type="text"
          placeholder="내 ID (받는 사람)"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {toast?.type === 'invitation' && toast.data && (
        <div className="mt-4 p-4 bg-blue-100 rounded">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => handleResponse(true)}
                className="flex-1 py-1 px-3 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
              >
                수락
              </button>
              <button
                type="button"
                onClick={() => handleResponse(false)}
                className="flex-1 py-1 px-3 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
              >
                거절
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`fixed top-4 right-4 p-4 rounded shadow-lg text-white min-w-[300px] 
          ${toastBackgroundColors[toast.type]}`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default receivePushEvent;
