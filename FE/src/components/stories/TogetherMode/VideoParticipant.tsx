import {
    useTracks,
  } from '@livekit/components-react';
  import { Track } from 'livekit-client';

  interface VideoParticipantProps {
    participant: any; // LiveKit Participant type
    role?: 'prince' | 'princess';
  }

  function VideoParticipant({ participant, role }: VideoParticipantProps) {
    const tracks = useTracks(
      [Track.Source.Camera],
      { onlySubscribed: false },
    ).filter((trackReference) => trackReference.participant.identity === participant.identity);

    const videoPublication = tracks[0]?.publication;
    const mediaTrack = videoPublication?.track;

    return (
      <div className="relative w-96 h-72 rounded-lg overflow-hidden bg-gray-800 shadow-lg">
        {mediaTrack && (
          <video
            ref={(el) => {
              if (el && mediaTrack) {
                mediaTrack.attach(el);
              }
            }}
            autoPlay
            muted
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
          {participant.identity}
          {' '}
          (
          {role || '관람자'}
          )
        </div>
      </div>
    );
  }

  export default VideoParticipant;
