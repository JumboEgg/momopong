import { useParticipants, useRoomContext } from '@livekit/components-react';
import VideoParticipant from './VideoParticipant';

interface VideoLayoutProps {
  userRole?: 'prince' | 'princess';
}

function VideoLayout({ userRole }: VideoLayoutProps) {
  const room = useRoomContext();
  const participants = useParticipants();

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
