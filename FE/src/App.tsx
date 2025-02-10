import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; // Router 제거
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeFirebaseMessaging } from './services/firebase';

// 보호된 라우트
import ProtectedRoute from './components/ProtectedRoute';

// 페이지 컴포넌트들
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import SubAccountPage from './pages/subAccount/SubAccountPage';
import Home from './pages/Home';
import Drawing from './pages/Drawing';
import Story from './pages/Story';
import MyHouse from './pages/MyHouse';
import Profile from './pages/Profile';
import Friends from './pages/Friends';
import Parent from './pages/Parent';
import Test from './pages/Test';
import MyBookStory from './components/myhouse/mybookstory/mybookstory';
import MyLetters from './components/myhouse/letters/letters';
import MyDrawing from './components/myhouse/mydrawing/mydrawing';

// 비디오 룸 컴포넌트 경로 확인
import VideoRoom from './components/video/VideoRoom'; // 경로 수정

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(config);
const messaging = getMessaging(app);

function App(): JSX.Element {
  useEffect(() => {
    const initNotifications = async () => {
      try {
        const token = await initializeFirebaseMessaging();
        console.log('FCM Token:', token);
        // 토큰을 서버에 전송하는 로직
      } catch (error) {
        console.error('푸시 토큰 가져오는 중에 에러 발생', error);
      }
    };

    initNotifications();
  }, []);

  const [toast, setToast] = useState<{
    type: 'error' | 'success' | 'invitation' | 'accept' | 'reject';
    message: string;
    data?: {
      inviterId: string;
      inviterName: string;
      inviteeId: string;
      inviteeName?: string; // 사용되지 않는 변수 처리
      bookId: string;
      bookTitle: string;
    };
  } | null>(null);

  /* 토스트 타입별 배경색 매핑 */
  const toastBackgroundColors = {
    error: 'bg-red-500',
    success: 'bg-green-500',
    invitation: 'bg-blue-500',
    accept: 'bg-green-500',
    reject: 'bg-yellow-500',
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
          } else {
            alert('토큰 등록이 불가능 합니다. 생성하려면 권한을 허용해주세요');
          }
        } else if (permission === 'denied') {
          alert('web push 권한이 차단되었습니다. 알림을 사용하시려면 권한을 허용해주세요');
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
          inviterName,
          inviteeId,
          bookId,
          bookTitle,
        } = payload.data;

        setToast({
          type: 'invitation',
          message: `${inviterName}님이 초대했습니다.`,
          data: {
            inviterId,
            inviterName,
            inviteeId,
            bookId,
            bookTitle,
          },
        });
      }
    });

    handleAllowNotification();

    // 컴포넌트 언마운트 시 리스너 해제
    return () => {
      handleMessage();
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-auto">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route
          path="/parents/login"
          element={(
            <ProtectedRoute requireAuth={false}>
              <Login />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/parents/signup"
          element={(
            <ProtectedRoute requireAuth={false}>
              <SignUp />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/test"
          element={(
            <ProtectedRoute requireAuth={false}>
              <Test />
            </ProtectedRoute>
          )}
        />

        {/* Protected Routes */}
        <Route
          path="/parents/:parent_id/children/*"
          element={(
            <ProtectedRoute>
              <SubAccountPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/home"
          element={(
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/drawing"
          element={(
            <ProtectedRoute>
              <Drawing />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/story/*"
          element={(
            <ProtectedRoute>
              <Story />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/house"
          element={(
            <ProtectedRoute>
              <MyHouse />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/profile"
          element={(
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/friends"
          element={(
            <ProtectedRoute>
              <Friends />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/parent"
          element={(
            <ProtectedRoute>
              <Parent />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/house/letters"
          element={(
            <ProtectedRoute>
              <MyLetters />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/house/mybookstory"
          element={(
            <ProtectedRoute>
              <MyBookStory />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/house/mydrawing"
          element={(
            <ProtectedRoute>
              <MyDrawing />
            </ProtectedRoute>
          )}
        />

        {/* 비디오 룸 라우트 추가 */}
        <Route path="/video-room" element={<VideoRoom />} />
      </Routes>

      {/* 토스트 알림 */}

      {/* 토스트 알림 렌더링 부분 */}
      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded shadow-lg text-white min-w-[300px] ${toastBackgroundColors[toast.type]}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default App;
