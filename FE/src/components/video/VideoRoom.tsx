import { useState, useEffect, useCallback } from 'react';
import {
  Room,
  RoomEvent,
  LocalParticipant,
  RemoteParticipant,
  VideoPresets,
} from 'livekit-client';

interface VideoRoomProps {
  roomName: string;
  participantName: string;
  userRole: 'prince' | 'princess';
  isUserTurn: boolean;
  audioEnabled: boolean;
}

function VideoRoom({
  roomName,
  participantName,
  userRole,
  isUserTurn,
  audioEnabled,
}: VideoRoomProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<(RemoteParticipant | LocalParticipant)[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // 참가자 상태 업데이트
  const updateParticipants = useCallback((currentRoom: Room) => {
    const remoteParticipants = Array.from(currentRoom.remoteParticipants.values());
    const allParticipants: (RemoteParticipant | LocalParticipant)[] = [
      currentRoom.localParticipant,
      ...remoteParticipants,
    ];
    setParticipants(allParticipants);
  }, []);

  // 토큰 발급
  const getToken = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName,
          participantName,
        }),
      });

      if (!response.ok) {
        throw new Error(`Token request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('Token error:', error);
      throw error;
    }
  }, [roomName, participantName]);

  // Room 연결 설정
  useEffect(() => {
    let isMounted = true;

    const connectToRoom = async () => {
      try {
        const token = await getToken();
        if (!isMounted) return;

        const newRoom = new Room({
          adaptiveStream: true,
          dynacast: true,
          videoCaptureDefaults: {
            resolution: VideoPresets.h720.resolution,
          },
          publishDefaults: {
            simulcast: true,
            videoEncoding: {
              maxBitrate: 2_500_000,
              maxFramerate: 30,
            },
          },
        });

        // 이벤트 리스너 설정
        newRoom
          .on(RoomEvent.ParticipantConnected, () => updateParticipants(newRoom))
          .on(RoomEvent.ParticipantDisconnected, () => updateParticipants(newRoom))
          .on(RoomEvent.TrackSubscribed, () => updateParticipants(newRoom))
          .on(RoomEvent.TrackUnsubscribed, () => updateParticipants(newRoom))
          .on(RoomEvent.Disconnected, () => {
            if (!isMounted) return;
            setConnectionError('Room disconnected');
          });

        // Room 연결
        await newRoom.connect(import.meta.env.VITE_LIVEKIT_URL, token);
        if (!isMounted) {
          await newRoom.disconnect();
          return;
        }

        // 초기 설정
        await newRoom.localParticipant.setName(participantName);
        await newRoom.localParticipant.setCameraEnabled(true);
        await newRoom.localParticipant.setMicrophoneEnabled(isUserTurn && audioEnabled);

        setRoom(newRoom);
        updateParticipants(newRoom);
      } catch (error) {
        console.error('Room connection failed:', error);
        if (isMounted) {
          setConnectionError(error instanceof Error ? error.message : 'Failed to connect');
        }
      }
    };

    connectToRoom();

    return () => {
      isMounted = false;
      if (room) {
        room.disconnect();
      }
    };
  }, [roomName, participantName, getToken, updateParticipants]);

  // 마이크 상태 관리
  useEffect(() => {
    if (!room) return;
    room.localParticipant.setMicrophoneEnabled(isUserTurn && audioEnabled);
  }, [room, isUserTurn, audioEnabled]);

  // 에러 처리
  if (connectionError) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        Error:
        {' '}
        {connectionError}
      </div>
    );
  }

  // 비디오 트랙 가져오기
  const getVideoTrack = useCallback((participant: LocalParticipant | RemoteParticipant) => {
    const videoPublication = Array.from(participant.getTrackPublications()).find(
      (pub) => pub.kind === 'video',
    );
    return videoPublication?.track;
  }, []);

  return (
    <div className="fixed bottom-8 right-8 flex gap-4">
      {participants.map((participant) => (
        <div
          key={participant.identity}
          className="relative w-48 h-36 bg-gray-800 rounded-lg overflow-hidden"
        >
          <video
            ref={(element) => {
              if (element) {
                const videoTrack = getVideoTrack(participant);
                if (videoTrack) {
                  videoTrack.attach(element);
                }
              }
            }}
            autoPlay
            playsInline
            muted={participant === room?.localParticipant}
            className="w-full h-full object-cover"
          >
            <track kind="captions" />
          </video>
          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
            <span className="text-white text-sm truncate">
              {participant.identity}
              {participant === room?.localParticipant ? ` (${userRole})` : ''}
            </span>
            {participant === room?.localParticipant && (
              <div className="flex gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isUserTurn ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  title={isUserTurn ? '내 차례' : '상대방 차례'}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default VideoRoom;
