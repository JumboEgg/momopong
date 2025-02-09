// LiveKit 연결 관리 컴포넌트
/* eslint-disable import/no-extraneous-dependencies */
import { LiveKitRoom } from '@livekit/components-react';

interface LiveKitProviderProps {
  children: React.ReactNode;
  token: string;
  serverUrl: string;
}

export function LiveKitProvider({ children, token, serverUrl }: LiveKitProviderProps) {
  return (
    <LiveKitRoom
      token={token} // 서버에서 보내주는 livekit 토큰
      serverUrl={serverUrl}
      connect
    >
      {children}
    </LiveKitRoom>
  );
}
