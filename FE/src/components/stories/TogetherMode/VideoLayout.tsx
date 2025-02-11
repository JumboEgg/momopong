import { useParticipants, useRoomContext } from '@livekit/components-react';
import { useEffect } from 'react';
import VideoParticipant from './VideoParticipant';

interface VideoLayoutProps {
  userRole?: 'prince' | 'princess';
  token: string;
  serverUrl: string;
}

function VideoLayout({ userRole, token, serverUrl }: VideoLayoutProps) {
  const room = useRoomContext();
  const participants = useParticipants();

  useEffect(() => {
    const connectToRoom = async () => {
      try {
        // URL 검증 및 포맷팅
        let formattedUrl = serverUrl;
        if (!formattedUrl.startsWith('wss://')) {
          formattedUrl = `wss://${formattedUrl}`;
        }

        console.log('Connecting to LiveKit with:', {
          url: formattedUrl,
          tokenLength: token.length,
        });

        await room.connect(formattedUrl, token);
        console.log('Successfully connected to room:', room.name);

        // 자동으로 카메라와 마이크 활성화
        await room.localParticipant.enableCameraAndMicrophone();
      } catch (error) {
        console.error('Failed to connect to room:', error);
      }
    };

    if (token && serverUrl) {
      connectToRoom();
    }

    return () => {
      room.disconnect();
    };
  }, [room, token, serverUrl]);

  return (
    <div className="absolute bottom-4 left-0 right-0 flex justify-between px-8">
      {room.localParticipant && (
        <VideoParticipant
          participant={room.localParticipant}
          role={userRole}
        />
      )}

      {participants.map((participant) => (
        <VideoParticipant
          key={participant.identity}
          participant={participant}
          role={userRole === 'prince' ? 'princess' : 'prince'}
        />
      ))}
    </div>
  );
}

export default VideoLayout;
