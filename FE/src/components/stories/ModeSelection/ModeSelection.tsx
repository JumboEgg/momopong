import { useStory } from '@/stores/storyStore';
import { useState } from 'react';

// 환경 변수 전체 로깅
console.log('전체 환경 변수:', import.meta.env);

// LiveKit 실제 설정
const LIVEKIT_CONFIG = {
  token: import.meta.env.VITE_LIVEKIT_API_KEY,
  serverUrl: import.meta.env.VITE_LIVEKIT_SERVER_URL,
} as const;

console.log('LiveKit 환경 변수:', {
  token: import.meta.env.VITE_LIVEKIT_API_KEY ? 'Token exists' : 'Token missing',
  serverUrl: import.meta.env.VITE_LIVEKIT_SERVER_URL ? 'ServerUrl exists' : 'ServerUrl missing',
});

function ModeSelection(): JSX.Element {

  const { setMode, setLivekitConfig} = useStory();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleTogetherMode = async () => {
    setIsConnecting(true);
    try {
      const { token, serverUrl } = LIVEKIT_CONFIG;

      // 더 자세한 로깅 추가
      console.group('LiveKit 설정 상세 로그');
      console.log('LIVEKIT_CONFIG:', LIVEKIT_CONFIG);
      console.log('환경 변수 토큰:', import.meta.env.VITE_LIVEKIT_API_KEY);
      console.log('환경 변수 서버 URL:', import.meta.env.VITE_LIVEKIT_SERVER_URL);
      console.log('실제 토큰:', token);
      console.log('실제 서버 URL:', serverUrl);
      console.groupEnd();

      // 설정값 확인
      if (!token || !serverUrl) {
        throw new Error('LiveKit configuration is missing');
      }

      setLivekitConfig(token, serverUrl);
      setMode('together');
    } catch (error) {
      console.error('Failed to initialize together mode:', error);
      alert('함께 읽기 모드 연결에 실패했습니다.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8">신데렐라 동화</h1>
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => setMode('reading')}
            className="py-4 px-6 text-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            읽기 모드
          </button>
          <button
            type="button"
            onClick={handleTogetherMode}
            disabled={isConnecting}
            className="py-4 px-6 text-lg font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isConnecting ? '연결 중...' : '함께 읽기 모드'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModeSelection;
