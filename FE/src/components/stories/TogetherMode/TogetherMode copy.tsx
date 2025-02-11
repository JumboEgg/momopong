// src/pages/TogetherMode.tsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import VideoRoom from '@/components/video/VideoRoom';

interface LocationState {
  roomName: string;
  participantName: string;
}

function TogetherMode() {
  const location = useLocation();
  const { roomName } = location.state as LocationState;
  const [isSessionEstablished, setIsSessionEstablished] = useState(false);

  useEffect(() => {
    // OpenVidu 세션 설정
    const initializeSession = async () => {
      try {
        // OpenVidu 세션 초기화 로직
        setIsSessionEstablished(true);
      } catch (error) {
        console.error('Failed to initialize OpenVidu session:', error);
      }
    };

    initializeSession();
  }, [roomName]);

  return (
    <div className="together-mode">
      {/* OpenVidu 컴포넌트들 */}
      {isSessionEstablished && (
        <div className="video-container">
          <VideoRoom />
        </div>
      )}
      {/* 동화, 나레이션, 녹음 등의 컴포넌트들 */}
    </div>
  );
}

export default TogetherMode;
