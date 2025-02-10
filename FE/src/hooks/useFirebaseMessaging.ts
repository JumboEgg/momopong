import { useState, useEffect } from 'react';
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
  const { setFCMToken } = useFCMStore();
  const { rejectInvitation, acceptInvitation } = useFriendListStore();
  const [showLiveKitRoom, setShowLiveKitRoom] = useState(false);
  const [roomInfo, setRoomInfo] = useState<{
    roomName: string;
    participantName: string;
  } | null>(null);
  const [invitationModal, setInvitationModal] = useState<InvitationModal>({
    isOpen: false,
    data: null,
  });

  const handleInvitationAccept = async () => {
    if (!invitationModal.data) return;

    const { inviterId, inviteeId, contentId: bookId } = invitationModal.data;

    try {
      await acceptInvitation(bookId, inviteeId, inviterId);

      // LiveKit 룸 정보 설정
      setRoomInfo({
        roomName: `book-${bookId}`,
        participantName: invitationModal.data.inviteeName,
      });
      setShowLiveKitRoom(true);
    } catch (error) {
      console.error('Failed to accept invitation:', error);
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
      console.log('전체 payload:', payload);
      const { showToast } = useToastStore.getState();

      if (payload.data) {
        // 초대 거절 알림을 받은 경우
        if (payload.data.type === 'invitation_rejected') {
          showToast({
            type: 'reject',
            message: `${payload.data.inviteeName}님이 초대를 거절했습니다.`,
          });
          return;
        }

        // 초대장을 받은 경우
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
    showLiveKitRoom,
    roomInfo,
  };
};
