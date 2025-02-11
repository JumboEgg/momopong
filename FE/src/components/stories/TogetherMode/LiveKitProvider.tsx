import { Room } from 'livekit-client';
import { LiveKitRoom } from '@livekit/components-react';
import { useState, useEffect } from 'react';

interface LiveKitProviderProps {
  children: React.ReactNode;
  token: string;
  serverUrl: string;
}

export function LiveKitProvider({
  children,
  token,
  serverUrl,
}: LiveKitProviderProps) {
  const [room] = useState(() => new Room());

  useEffect(() => {
    const connectRoom = async () => {
      try {
        // 토큰 유효성 검사 - POST 메서드로 변경
        console.log('토큰 연결 시도', {
          tokenLength: token.length,
          serverUrl,
        });

        const validateResponse = await fetch(`${serverUrl}/rtc/validate`, {
          method: 'POST', // GET에서 POST로 변경
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // 필요한 경우 추가 파라미터
            access_token: token,
          }),
        });

        if (!validateResponse.ok) {
          const errorText = await validateResponse.text();
          throw new Error(`Token validation failed: ${errorText}`);
        }

        console.log(serverUrl);

        // LiveKit 방 연결
        await room.connect(serverUrl, token, {
          autoSubscribe: true,
        });

        console.log('LiveKit 연결 성공');
      } catch (error) {
        console.error('LiveKit 연결 상세 오류:', {
          errorMessage: error instanceof Error ? error.message : '알 수 없는 오류',
          token,
          serverUrl,
        });
      }
    };

    connectRoom();

    return () => {
      room.disconnect();
    };
  }, [token, serverUrl, room]);

  return (
    <LiveKitRoom
      room={room}
      token={token}
      serverUrl={serverUrl}
    >
      {children}
    </LiveKitRoom>
  );
}
