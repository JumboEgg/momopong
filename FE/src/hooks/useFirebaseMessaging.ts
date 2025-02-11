import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';
import { tokenService } from '@/services/tokenService';
import useFCMStore from '@/stores/useFCMStore';
import { useFriendListStore } from '@/stores/friendListStore';
import useToastStore from '@/stores/toastStore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export interface InvitationData {
  inviterId: number;
  inviterName: string;
  inviteeId: number;
  inviteeName: string;
  contentId: number;
  contentTitle: string;
}

export interface InvitationModal {
    isOpen: boolean;
    data: InvitationData | null;
  }

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const useFirebaseMessaging = () => {
  const navigate = useNavigate();
  const { setFCMToken } = useFCMStore();
  const { rejectInvitation, acceptInvitation } = useFriendListStore();

  const [invitationModal, setInvitationModal] = useState<InvitationModal>({
    isOpen: false,
    data: null,
  });

  const handleInvitationAccept = async () => {
    if (!invitationModal.data) return;

    const { inviterId, inviteeId, contentId: bookId } = invitationModal.data;
    const { showToast } = useToastStore.getState();

    try {
      await acceptInvitation(bookId, inviteeId, inviterId);

      // TogetherMode로 이동하면서 state로 정보 전달
      navigate(`/book/${bookId}/together`, {
        state: {
          roomName: `book-${bookId}`,
          participantName: invitationModal.data.inviteeName,
        },
      });
    } catch (error) {
      console.error('Failed to accept invitation:', error);
      showToast({
        type: 'error',
        message: '초대 수락 처리 중 오류가 발생했습니다.',
      });
    }

    setInvitationModal({ isOpen: false, data: null });
  };

  const handleInvitationReject = async () => {
    if (!invitationModal.data) return;

    const { inviterId, inviteeId, contentId: bookId } = invitationModal.data;

    await rejectInvitation(bookId, inviteeId, inviterId);
    setInvitationModal({ isOpen: false, data: null });
  };

  useEffect(() => {
    const handleAllowNotification = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
          });

          if (token) {
            console.log('FCM Token:', token);
            const currentChildId = tokenService.getCurrentChildId();
            if (currentChildId) {
              await setFCMToken(currentChildId, token);
            }
          } else {
            console.error('토큰 등록이 불가능합니다.');
          }
        } else if (permission === 'denied') {
          console.error('web push 권한이 차단되었습니다.');
        }
      } catch (error) {
        console.error('푸시 토큰 가져오는 중에 에러 발생', error);
      }
    };

    const handleMessage = onMessage(messaging, (payload) => {
      const currentChildId = tokenService.getCurrentChildId();
      const { showToast } = useToastStore.getState();

      if (!payload.data || !currentChildId) return;

      const {
        inviterId,
        inviteeId,
        inviterName,
        inviteeName,
        contentId,
        contentTitle,
        notificationType,
      } = payload.data;

      console.log('FCM Message received:', {
        currentChildId,
        inviterId,
        inviteeId,
        notificationType,
      });

      // 초대장을 받은 경우
      if (notificationType === 'INVITE' && Number(inviteeId) === currentChildId) {
        setInvitationModal({
          isOpen: true,
          data: {
            inviterId: Number(inviterId),
            inviterName,
            inviteeId: Number(inviteeId),
            inviteeName,
            contentId: Number(contentId),
            contentTitle,
          },
        });

        showToast({
          type: 'invitation',
          message: `${inviterName}님이 "${contentTitle}" 여행에 초대했어요!`,
        });
      } else if (notificationType === 'ACCEPT' && Number(inviterId) === currentChildId) {
        // 초대 수락을 받은 경우
        showToast({
          type: 'accept',
          message: `${inviteeName}님이 "${contentTitle}" 여행 초대를 수락했어요!`,
        });

        // 초대자도 TogetherMode로 이동
        navigate(`/book/${contentId}/together`, {
          state: {
          roomName: `book-${contentId}`,
          participantName: inviterName,
          },
        });
      } else if (notificationType === 'REJECT' && Number(inviterId) === currentChildId) {
        // 초대 거절을 받은 경우
        showToast({
          type: 'reject',
          message: `${inviteeName}님이 "${contentTitle}" 여행 초대를 거절했어요`,
        });
      }
    });
    handleAllowNotification();

    return () => {
      handleMessage();
    };
  }, [setFCMToken]);

  return {
    invitationModal,
    handleInvitationAccept,
    handleInvitationReject,

  };
};
