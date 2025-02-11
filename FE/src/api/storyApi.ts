import axios from 'axios';
import { tokenService } from '@/services/tokenService';

const api = axios.create({
  baseURL: 'https://i12d103.p.ssafy.io',
  headers: {
    'Content-Type': 'application/json',
  },
});

// FCM 토큰 저장 API
export const saveFCMToken = async (childId: number, token: string) => {
  try {
    const accessToken = tokenService.getAccessToken();
    if (!accessToken) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await api.post(
      '/api/fcm/save-token',
      {
        childId,
        token,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
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
export const deleteFCMToken = async (childId: number) => {
  try {
    const accessToken = tokenService.getAccessToken();
    if (!accessToken) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await api.post(
      '/api/fcm/delete-token',
      {
        childId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('FCM 토큰 삭제 실패:', error);
    throw error;
  }
};
