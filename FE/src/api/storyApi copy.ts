import axios from 'axios';
import { tokenService } from '@/services/tokenService';
import { messaging, HandleAllowNotification } from '@/services/firebaseService';
import { getToken } from 'firebase/messaging';

// 기존 타입 정의에 추가
export interface Friend {
  childId: string;
  name: string;
  profile: string;
}

const api = axios.create({
  baseURL: 'https://i12d103.p.ssafy.io',
  headers: {
    'Content-Type': 'application/json',
  },
});

// FCM 토큰 저장 API
export const saveFCMToken = async (childId: string, token: string) => {
  try {
    const response = await axios.post(
'/api/fcm/save-token',
      {
        childId,
        token,
      },
      {
        headers: {
          Authorization: `Bearer ${tokenService.getAccessToken()}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('FCM 토큰 저장 실패:', error);
    throw error;
  }
};

// FCM 토큰 삭제 API
export const deleteFCMToken = async (childId: string, token: string) => {
  try {
    const response = await axios.post(
'/api/fcm/delete-token',
      {
        childId,
        token,
      },
      {
        headers: {
          Authorization: `Bearer ${tokenService.getAccessToken()}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('FCM 토큰 삭제 실패:', error);
    throw error;
  }
};

// 플레이 가능한 친구 목록 조회
export const getOnlineFriends = async (bookId: string, childId: string): Promise<Friend[]> => {
  try {
    const token = tokenService.getActiveToken();
    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    console.log('API 요청 정보:', {
      url: `/api/book/${bookId}/friend/${childId}`,
      token: `Bearer ${token.substring(0, 10)}...`,
    });

    const response = await api.get(`/api/book/${bookId}/friend/${childId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('API 응답:', response.data);

    if (!Array.isArray(response.data)) {
      console.error('잘못된 응답 형식:', response.data);
      throw new Error('서버 응답 형식이 올바르지 않습니다.');
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API 에러:', {
        status: error.response?.status,
        data: error.response?.data,
      });

      switch (error.response?.status) {
        case 401:
          throw new Error('인증이 필요합니다.');
        case 403:
          throw new Error('접근 권한이 없습니다.');
        case 404:
          throw new Error('친구 목록을 찾을 수 없습니다.');
        default:
          throw new Error('친구 목록을 불러오는데 실패했습니다.');
      }
    }
    throw error;
  }
};

// 친구 초대 API
export const inviteFriendToPlay = async (
  bookId: string,
  inviterId: string,
  inviteeId: string,
) => {
  try {
    const token = tokenService.getActiveToken();
    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    // Number.isNaN() 사용
    const bookIdNum = Number(bookId);
    const inviterIdNum = Number(inviterId);
    const inviteeIdNum = Number(inviteeId);

    console.log('초대 요청 상세 정보:', {
      bookId: bookIdNum,
      inviterId: inviterIdNum,
      inviteeId: inviteeIdNum,
      token: `${token}...`,
    });
    if (Number.isNaN(bookIdNum) || Number.isNaN(inviterIdNum) || Number.isNaN(inviteeIdNum)) {
      throw new Error('유효하지 않은 ID 형식입니다.');
    }

    // const response = await api.post(
    //   `/api/book/${bookIdNum}/friend/${inviterIdNum}/invitation`,
    //   { inviteeId: inviteeIdNum },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       'Content-Type': 'application/json',
    //     },
    //   },
    // );

    // FCM 토큰 가져오기
    await HandleAllowNotification();
    const fcmToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    console.log('초대 요청:', {
      url: `/api/book/${bookId}/friend/${inviterId}/invitation`,
      body: {
        inviteeId,
        fcm_token: fcmToken, // FCM 토큰 추가
      },
    });

    const requestBody = { inviteeId };
    console.log('초대 요청 상세 정보:', {
      bookId,
      inviterId,
      inviteeId,
      requestBody,
      fullUrl: `/api/book/${bookId}/friend/${inviterId}/invitation`, // 전체 URL 로깅
      token: `${token.substring(0, 10)}...`,
    });

    const response = await api.post(
      `/api/book/${bookId}/friend/${inviterId}/invitation`,
      {
        inviteeId,
        // fcm_token: fcmToken, // FCM 토큰 추가
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('친구 초대 실패:', error);
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 401:
          throw new Error('인증이 필요합니다.');
        case 403:
          throw new Error('초대 권한이 없습니다.');
        case 404:
          throw new Error('유효하지 않은 초대입니다.');
        default:
          throw new Error('친구 초대에 실패했습니다.');
      }
    }
    throw error;
  }
};
