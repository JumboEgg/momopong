import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getMessaging, Messaging, getToken, onMessage,
} from 'firebase/messaging';

// Firebase 구성 객체
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Firebase 앱 초기화
const app: FirebaseApp = initializeApp(firebaseConfig);

// 메시징 인스턴스 가져오기
const messaging: Messaging = getMessaging(app);

// FCM 권한 요청 및 토큰 반환
export async function HandleAllowNotification(): Promise<string | null> {
  try {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });

      if (token) {
        console.log('FCM 토큰 생성 성공:', `${token.substring(0, 10)}...`);
        return token;
      }

      console.error('토큰을 생성할 수 없습니다.');
      return null;
    }

    if (permission === 'denied') {
      console.error('알림 권한이 거부되었습니다.');
      return null;
    }

    return null;
  } catch (error) {
    console.error('FCM 토큰 생성 중 에러:', error);
    throw error;
  }
}

// 메시지 리스너
export const onMessageListener = () => new Promise((resolve) => {
  onMessage(messaging, (payload) => {
    console.log('새로운 메시지 수신:', payload);
    resolve(payload);
  });
});

export { app, messaging };
