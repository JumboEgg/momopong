import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';
import { tokenService } from '@/services/tokenService';
import useFCMStore from '@/stores/useFCMStore';
import { useFriendListStore } from '@/stores/friendListStore';
import useToastStore from '@/stores/toastStore';
import { ContentType } from '@/types/invitation';
import type { NotificationType } from '@/types/notification';

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
  contentType: ContentType;
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

   // 공통 유틸리티 함수들
   const navigateToContent = (
    contentType: ContentType,
    contentId: number,
    participantName: string,
) => {
    const basePath = contentType === 'BOOK' ? 'book' : 'sketch';
    navigate(`/${basePath}/${contentId}/together`, {
      state: {
        roomName: `${basePath}-${contentId}`,
        participantName,
      },
    });
  };

  const showContentTypeMessage = (
    type: NotificationType,
    contentType: ContentType,
    messages: { book: string; sketch: string },
  ) => {
    const { showToast } = useToastStore.getState();
    showToast({
      type,
      message: contentType === 'BOOK' ? messages.book : messages.sketch,
    });
  };

  const handleInvitationAccept = async () => {
    if (!invitationModal.data) return;

    const {
      inviterId,
      inviteeId,
      contentId,
      contentType,
      inviteeName,
      inviterName,
      contentTitle,
    } = invitationModal.data;

    try {
      await acceptInvitation({
        contentId,
        inviterId,
        inviteeId,
        contentType,
        inviterName,
        inviteeName,
        contentTitle,
      });

      navigateToContent(contentType, contentId, inviteeName);
    } catch (error) {
      console.error('Failed to accept invitation:', error);
      showContentTypeMessage('error', contentType, {
        book: '동화 초대 수락 처리 중 오류가 발생했습니다.',
        sketch: '그림 초대 수락 처리 중 오류가 발생했습니다.',
      });
    }

    setInvitationModal({ isOpen: false, data: null });
  };

  const handleInvitationReject = async () => {
    if (!invitationModal.data) return;

    const {
      inviterId,
      inviteeId,
      contentId,
      contentType,
      inviterName,
      inviteeName,
      contentTitle,
    } = invitationModal.data;

    try {
      await rejectInvitation({
        contentId,
        inviterId,
        inviteeId,
        contentType,
        inviterName,
        inviteeName,
        contentTitle,
      });
    } catch (error) {
      console.error('Failed to reject invitation:', error);
      showContentTypeMessage('error', contentType, {
        book: '동화 초대 거절 처리 중 오류가 발생했습니다.',
        sketch: '그림 초대 거절 처리 중 오류가 발생했습니다.',
      });
    }

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
        if (!payload.data || !currentChildId) return;

        const {
          inviterId,
          inviteeId,
          inviterName,
          inviteeName,
          contentId,
          contentTitle,
          contentType: rawContentType,
          notificationType,
        } = payload.data;

        // 타입 가드를 사용한 검증
        const isValidContentType = (type: string): type is ContentType => type === 'BOOK' || type === 'SKETCH';

        if (!isValidContentType(rawContentType)) {
          console.error('Invalid content type:', rawContentType);
          return;
        }

        const contentType = rawContentType; // ContentType 타입으로 보장

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
              contentType,
            },
          });

          showContentTypeMessage('invitation', contentType, {
            book: `${inviterName}님이 "${contentTitle}" 여행에 초대했어요!`,
            sketch: `${inviterName}님이 "${contentTitle}" 함께 그리기에 초대했어요!`,
          });
        } else if (notificationType === 'ACCEPT' && Number(inviterId) === currentChildId) {
          showContentTypeMessage('accept', contentType, {
            book: `${inviteeName}님이 "${contentTitle}" 여행 초대를 수락했어요!`,
            sketch: `${inviteeName}님이 "${contentTitle}" 함께 그리기를 수락했어요!`,
          });

          navigateToContent(contentType, Number(contentId), inviterName);
        } else if (notificationType === 'REJECT' && Number(inviterId) === currentChildId) {
          showContentTypeMessage('reject', contentType, {
            book: `${inviteeName}님이 "${contentTitle}" 여행 초대를 거절했어요`,
            sketch: `${inviteeName}님이 "${contentTitle}" 함께 그리기를 거절했어요`,
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
