import { useState, useEffect, useCallback } from 'react';
import {
  Room,
  RoomEvent,
  RemoteParticipant,
  LocalParticipant,
  VideoPresets,
  DisconnectReason,
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
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const { audioEnabled, addRecording, currentIndex } = useStory();

  // 녹음 상태 변경 시 부모 컴포넌트에 알림
  // useEffect(() => {
  //   onRecordingStateChange(isRecording);
  // }, [isRecording, onRecordingStateChange]);

  // 참가자 상태 업데이트
  const updateParticipants = useCallback((currentRoom: Room) => {
    const remoteParticipants = Array.from(currentRoom.remoteParticipants.values());
    const allParticipants = [currentRoom.localParticipant, ...remoteParticipants];
    setParticipants(allParticipants);
  }, []);

  // 녹음 중지
  const stopRecording = useCallback(() => {
    if (!isRecording) return;
    setIsRecording(false);
    setTimeLeft(20);
  }, [isRecording]);

  // 녹음 시작
  const startRecording = useCallback(async () => {
    if (!isUserTurn || isRecording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);

        addRecording(currentIndex, {
          characterType: userRole,
          audioUrl,
          timestamp: Date.now(),
        });

        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
      };

      setIsRecording(true);
      setTimeLeft(20);
      mediaRecorder.start();

      // 20초 후 자동 중지
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, 20000);
    } catch (error) {
      console.error('녹음 시작 실패:', error);
      alert('마이크 접근에 실패했습니다. 마이크 권한을 확인해주세요.');
      setIsRecording(false);
    }
  }, [isUserTurn, isRecording, currentIndex, userRole, addRecording]);

  // 타이머 처리
  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (isRecording) {
      timerId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerId);
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isRecording, stopRecording]);

  // 토큰 가져오기
  const handleGetToken = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName,
          participantName,
        }),
      });

      if (!response.ok) throw new Error(`Token request failed: ${response.status}`);
      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('Token error:', error);
      throw error;
    }
  }, [roomName, participantName]);

  // LiveKit 룸 초기화
  useEffect(() => {
    let isMounted = true;

    const initRoom = async () => {
      try {
        const token = await handleGetToken();
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
          .on(RoomEvent.TrackSubscribed, () => {
            if (isMounted) updateParticipants(newRoom);
          })
          .on(RoomEvent.TrackUnsubscribed, () => {
            if (isMounted) updateParticipants(newRoom);
          })
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
        await newRoom.localParticipant.setMicrophoneEnabled(
          isUserTurn && (audioEnabled || isRecording),
        );

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
  }, [
    roomName,
    participantName,
    handleGetToken,
    updateParticipants,
    isUserTurn, audioEnabled, isRecording]);

  // 마이크 상태 관리
  useEffect(() => {
    if (!room) return;
    room.localParticipant.setMicrophoneEnabled(isUserTurn && (audioEnabled || isRecording));
  }, [room, isUserTurn, audioEnabled, isRecording]);

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
      {participants.map((participant) => {
        // LiveKit의 published tracks에서 비디오 트랙 찾기
        const videoPublication = Array.from(participant.getTrackPublications()).find(
          (pub) => pub.kind === 'video',
        );
        const videoTrack = videoPublication?.track;

        return (
          <div
            key={participant.identity}
            className="relative w-48 h-36 bg-gray-800 rounded-lg overflow-hidden"
          >
            <video
              ref={(element) => {
                if (element && videoTrack) {
                  videoTrack.attach(element);
                }
              }}
              autoPlay
              playsInline
              muted={participant === room?.localParticipant}
              className="w-full h-full object-cover"
            >
              <track kind="captions" srcLang="ko" label="Korean" />
            </video>
            <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
              <span className="text-white text-sm truncate">
                {participant.name || participant.identity}
                {participant === room?.localParticipant
                  ? ` (${userRole === 'prince' ? '왕자님' : '신데렐라'})`
                  : ''}
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
        );
      })}

      {/* 녹음 버튼 */}
      {isUserTurn && (
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full 
            ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} 
            text-white font-medium transition-colors`}
        >
          {isRecording ? `녹음 중... (${timeLeft}초)` : '녹음 시작'}
        </button>
      )}

      {/* 녹음 진행바 */}
      {isRecording && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-48 h-2 bg-gray-200 rounded">
          <div
            className="h-full bg-red-500 rounded transition-all duration-1000"
            style={{ width: `${(timeLeft / 20) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default IntegratedRoom;
