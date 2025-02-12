import { useState, useEffect, useCallback } from 'react';
import {
  Room,
  RoomEvent,
  RemoteParticipant,
  LocalParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Track,
  VideoPresets,
  DisconnectReason,
  Participant,
} from 'livekit-client';
import { useStory } from '@/stores/storyStore';

interface IntegratedRoomProps {
  roomName: string;
  participantName: string;
  userRole: 'prince' | 'princess';
  isUserTurn: boolean;
}

function IntegratedRoom({
  roomName,
  participantName,
  userRole,
  isUserTurn,
}: IntegratedRoomProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<(RemoteParticipant | LocalParticipant)[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { audioEnabled } = useStory();

  // 참가자 상태 업데이트
  const updateParticipants = useCallback((currentRoom: Room) => {
    const remoteParticipants = Array.from(currentRoom.remoteParticipants.values());
    const allParticipants: (RemoteParticipant | LocalParticipant)[] = [...remoteParticipants];

    if (currentRoom.localParticipant) {
      allParticipants.unshift(currentRoom.localParticipant);
    }

    setParticipants(allParticipants);
  }, []);

  // 토큰 가져오기
  const handleGetToken = useCallback(async (roomId: string, participantId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName: roomId,
          participantName: participantId,
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
  }, []);

  // LiveKit 룸 초기화
  useEffect(() => {
    let isMounted = true;

    const initRoom = async () => {
      try {
        const token = await handleGetToken(roomName, participantName);
        if (!isMounted) return;

        const roomOptions = {
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
        };

        const newRoom = new Room(roomOptions);

        // 이벤트 리스너 등록
        newRoom
          .on(RoomEvent.ParticipantConnected, () => {
            if (isMounted) updateParticipants(newRoom);
          })
          .on(RoomEvent.ParticipantDisconnected, () => {
            if (isMounted) updateParticipants(newRoom);
          })
          .on(
        RoomEvent.TrackSubscribed,
            (
                track: RemoteTrack,
                publication: RemoteTrackPublication,
                participant: RemoteParticipant,
            ) => {
              if (!isMounted) return;
              console.log('Track subscribed:', track.kind, 'from', participant.identity);
              updateParticipants(newRoom);
            },
          )
          .on(
        RoomEvent.TrackUnsubscribed,
            (
                track: RemoteTrack,
                publication: RemoteTrackPublication,
                participant: RemoteParticipant,
            ) => {
              if (!isMounted) return;
              console.log('Track unsubscribed:', track.kind, 'from', participant.identity);
              updateParticipants(newRoom);
            },
          )
          .on(RoomEvent.Disconnected, (reason?: DisconnectReason) => {
            if (!isMounted) return;
            if (reason) {
              setConnectionError(`Room disconnected: ${reason}`);
            }
          });

        // 룸 연결
        await newRoom.connect(import.meta.env.VITE_LIVEKIT_URL, token);
        if (!isMounted) {
          await newRoom.disconnect();
          return;
        }

        await newRoom.localParticipant.setName(participantName);

        // 초기 비디오/오디오 설정
        await newRoom.localParticipant.setCameraEnabled(true);
        await newRoom.localParticipant.setMicrophoneEnabled(isUserTurn && audioEnabled);

        setRoom(newRoom);
        updateParticipants(newRoom);
      } catch (err) {
        console.error('Failed to connect to LiveKit room:', err);
        if (isMounted) {
          setConnectionError(err instanceof Error ? err.message : 'Failed to connect to room');
        }
      }
    };

    initRoom();

    return () => {
      isMounted = false;
      if (room) {
        room.disconnect();
      }
    };
  }, [roomName, participantName, handleGetToken, updateParticipants, isUserTurn, audioEnabled]);

  // 마이크 상태 관리
  useEffect(() => {
    if (!room) return;

    const { localParticipant } = room;
    localParticipant.setMicrophoneEnabled(isUserTurn && audioEnabled);
  }, [room, isUserTurn, audioEnabled]);

  const getVideoTrack = useCallback((participant: Participant) => {
    const videoPublication = Array.from(participant.getTrackPublications().values())
      .find((publication) => publication.kind === Track.Kind.Video);
    return videoPublication?.track;
  }, []);

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
            <track kind="captions" src="" />
          </video>
          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
            <span className="text-white text-sm truncate">
              {participant.name || participant.identity}
              {participant === room?.localParticipant ? (
                ` (${userRole === 'prince' ? '왕자님' : '신데렐라'})`
              ) : ''}
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

export default IntegratedRoom;
