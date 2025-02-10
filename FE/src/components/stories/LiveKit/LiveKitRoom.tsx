// src/components/LiveKitRoom.tsx
import { useEffect, useState } from 'react';
import {
  LocalVideoTrack,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
} from 'livekit-client';
import VideoComponent from './VideoComponent';
import AudioComponent from './AudioComponent';

interface LiveKitRoomProps {
  roomName: string;
  participantName: string;
  onLeaveRoom: () => void;
}

type TrackInfo = {
  trackPublication: RemoteTrackPublication;
  participantIdentity: string;
};

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL || 'ws://localhost:7880/';

function LiveKitRoom({ roomName, participantName, onLeaveRoom }: LiveKitRoomProps) {
  const [room, setRoom] = useState<Room>();
  const [localTrack, setLocalTrack] = useState<LocalVideoTrack>();
  const [remoteTracks, setRemoteTracks] = useState<TrackInfo[]>([]);

  useEffect(() => {
    const connectToRoom = async () => {
      const newRoom = new Room();
      setRoom(room);

      newRoom.on(
        RoomEvent.TrackSubscribed,
        (
          _track: RemoteTrack,
          publication: RemoteTrackPublication,
          participant: RemoteParticipant,
        ) => {
          setRemoteTracks((prev) => [
            ...prev,
            { trackPublication: publication, participantIdentity: participant.identity },
          ]);
        },
      );

      newRoom.on(
        RoomEvent.TrackUnsubscribed,
        (_track: RemoteTrack, publication: RemoteTrackPublication) => {
        setRemoteTracks((prev) => prev
        .filter((track) => track.trackPublication.trackSid !== publication.trackSid));
      },
    );

      try {
        const token = 'test';
        // const token = await getToken(roomName, participantName);
        await newRoom.connect(LIVEKIT_URL, token);
        await newRoom.localParticipant.enableCameraAndMicrophone();

        const videoTrack = newRoom.localParticipant.videoTrackPublications.values().next().value;
        if (videoTrack) {
          setLocalTrack(videoTrack.videoTrack);
        }
      } catch (error) {
        console.error('Failed to connect to room:', error);
        // await leaveRoom();
      }
    };

    connectToRoom();

    return () => {
      room?.disconnect();
    };
  }, [roomName, participantName]);

  const leaveRoom = async () => {
    await room?.disconnect();
    setRoom(undefined);
    setLocalTrack(undefined);
    setRemoteTracks([]);
    onLeaveRoom();
  };

  return (
    <div className="room-container">
      <div className="room-header">
        <h2>{roomName}</h2>
        <button
          type="button"
          className="leave-button"
          onClick={leaveRoom}
        >
          나가기
        </button>
      </div>
      <div className="video-grid">
        {localTrack && (
          <VideoComponent
            track={localTrack}
            participantIdentity={participantName}
            local
          />
        )}
        {remoteTracks.map((remoteTrack) => (remoteTrack.trackPublication.kind === 'video' ? (
          <VideoComponent
            key={remoteTrack.trackPublication.trackSid}
            track={remoteTrack.trackPublication.videoTrack!}
            participantIdentity={remoteTrack.participantIdentity}
          />
          ) : (
            <AudioComponent
              key={remoteTrack.trackPublication.trackSid}
              track={remoteTrack.trackPublication.audioTrack!}
            />
          )))}
      </div>
    </div>
  );
}

// async function getToken(roomName: string, participantName: string) {
//   const response = await fetch('/api/livekit/token', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       roomName,
//       participantName,
//     }),
//   });

//   if (!response.ok) {
//     const error = await response.json();
//     throw new Error(`Failed to get token: ${error.message}`);
//   }

//   const data = await response.json();
//   return data.token;
// }

export default LiveKitRoom;
