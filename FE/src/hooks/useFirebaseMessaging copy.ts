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
    templateName?: string, // templateName 추가
  ) => {
    if (contentType === 'BOOK') {
      // BOOK 로직 유지
      navigate(`/book/${contentId}/together`, {
        state: {
          roomName: `book-${contentId}`,
          participantName,
        },
      });
    } else {
      // SKETCH에 templateName 추가
      navigate('/drawing', {
        state: {
          waitingForResponse: true,
          templateId: contentId,
          templateName, // 템플릿 이름 추가
          participantName,
        },
      });
    }
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

    const currentChildId = tokenService.getCurrentChildId();
    if (!currentChildId) {
      console.error('No current child ID found');
      return;
    }

    const fcmStore = useFCMStore.getState();
    fcmStore.setProcessingInvitation(true);

    const {
      inviterId,
      contentId,
      contentType,
      inviteeName,
      inviterName,
      contentTitle,
    } = invitationModal.data;

    try {
      setInvitationModal({ isOpen: false, data: null });

      await acceptInvitation({
        contentId,
        inviterId,
        inviteeId: currentChildId,
        contentType,
        inviterName,
        inviteeName,
        contentTitle,
      });

      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });

      if (contentType === 'SKETCH') {
        navigate('/drawing', {
          state: {
            templateId: contentId,
            participantName: inviterName,
          },
        });
      } else {
        navigateToContent(contentType, contentId, inviterName);
      }
    } catch (error) {
      console.error('Failed to accept invitation:', error);
      showContentTypeMessage('error', contentType, {
        book: '동화 초대 수락 처리 중 오류가 발생했습니다.',
        sketch: '그림 초대 수락 처리 중 오류가 발생했습니다.',
      });
    } finally {
      setTimeout(() => {
        fcmStore.setProcessingInvitation(false);
      }, 2000);
    }
  };

  const handleInvitationReject = async () => {
    if (!invitationModal.data) return;

    const currentChildId = tokenService.getCurrentChildId();
    if (!currentChildId) {
      console.error('No current child ID found');
      return;
    }

    // 프로세싱 중인지 확인
    const fcmStore = useFCMStore.getState();
    if (fcmStore.processingInvitation) {
      console.log('Another invitation is being processed');
      return;
    }

    const {
      inviterId,
      contentId,
      contentType,
      inviterName,
      inviteeName,
      contentTitle,
    } = invitationModal.data;

    try {
      // 모달 상태를 먼저 업데이트
      setInvitationModal({ isOpen: false, data: null });

      await rejectInvitation({
        contentId,
        inviterId,
        inviteeId: currentChildId,
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

      // 현재 처리 상태 로깅
      const { processingInvitation } = useFCMStore.getState();
      console.log('FCM Message Handler State:', {
        processingInvitation,
        notificationType: payload.data.notificationType,
        currentChildId,
        messageData: payload.data,
      });

      // 초대 처리 중인 경우 확실히 리턴
      if (processingInvitation) {
        console.log('Skipping FCM message - invitation is being processed');
        return;
      }

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

        if (notificationType === 'INVITE') {
          // 자기 자신에게 온 초대는 무시
          if (Number(inviterId) === Number(inviteeId)) {
            console.log('Skipping self-invitation', { inviterId, inviteeId });
            return;
          }

          // 실제 초대 대상인 경우만 처리
          if (Number(inviteeId) === currentChildId) {
            console.log('Processing invitation for current user', {
              currentChildId,
              inviterId,
              inviteeId,
            });

            setInvitationModal({
              isOpen: true,
              data: {
                inviterId: Number(inviterId),
                inviterName,
                inviteeId: currentChildId, // 현재 사용자 ID 사용
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
          }
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
