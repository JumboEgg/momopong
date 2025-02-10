import { useState, useEffect } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';
import { tokenService } from '@/services/tokenService';
import useFCMStore from '@/stores/useFCMStore';

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
  const [invitationModal, setInvitationModal] = useState<InvitationModal>({
    isOpen: false,
    data: null,
  });
  const { setFCMToken } = useFCMStore();

  const handleInvitationAccept = async () => {
    if (!invitationModal.data) return;

    // TODO: 초대 수락 로직 구현
    console.log('초대 수락:', invitationModal.data);

    setInvitationModal({ isOpen: false, data: null });
  };

  const handleInvitationReject = () => {
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
      console.log('전체 payload:', payload);

      if (payload.data) {
        const {
            inviterId,
            inviteeId,
            inviterName,
            inviteeName,
            contentId,
            contentTitle,
        } = payload.data;

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
