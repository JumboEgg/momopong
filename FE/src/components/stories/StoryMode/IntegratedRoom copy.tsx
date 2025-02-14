import {
  useState, useEffect, useCallback, useRef,
} from 'react';
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
  onRecordingComplete: (participantId: string) => void;
}

function IntegratedRoom({
  roomName,
  participantName,
  userRole,
  isUserTurn,
  onRecordingComplete,
}: IntegratedRoomProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<(RemoteParticipant | LocalParticipant)[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const { audioEnabled, addRecording, currentIndex } = useStory();
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

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
    if (!isRecording || !mediaRecorder) return;
    mediaRecorder.stop();
    setIsRecording(false);
    setTimeLeft(20);
  }, [isRecording, mediaRecorder]);

  // 녹음 상태 브로드캐스트
  const broadcastRecordingStatus = useCallback(
    (status: 'idle' | 'recording' | 'completed') => {
      if (!room) return;

      const message = {
        type: 'recording_status',
        content: {
          recordingStatus: status,
          sender: room.localParticipant.identity,
        },
      };

      room.localParticipant.publishData(
        new TextEncoder().encode(JSON.stringify(message)),
        { reliable: true },
      );
    },
    [room],
  );

  // 녹음 시작
  const startRecording = useCallback(async () => {
    if (!isUserTurn || isRecording || !room) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);

        addRecording(currentIndex, {
          characterType: userRole,
          audioUrl,
          timestamp: Date.now(),
        });

        stream.getTracks().forEach((track) => track.stop());
        audioStreamRef.current = null;
        setMediaRecorder(null);
        setIsRecording(false);

        // 녹음 완료 알림
        broadcastRecordingStatus('completed');
        onRecordingComplete(room.localParticipant.identity);

        // 녹음된 오디오 재생
        const audio = new Audio(URL.createObjectURL(audioBlob));
        audio.play();
      };

      setMediaRecorder(recorder);
      setIsRecording(true);
      setTimeLeft(20);
      recorder.start();

      // 20초 후 자동 중지
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }, 20000);
      broadcastRecordingStatus('recording');
    } catch (error) {
      console.error('녹음 시작 실패:', error);
      alert('마이크 접근에 실패했습니다. 마이크 권한을 확인해주세요.');
      setIsRecording(false);
    }
  }, [
    isUserTurn,
    isRecording,
    currentIndex, userRole, addRecording, onRecordingComplete, broadcastRecordingStatus]);

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

      {isRecording && (
        <button
          type="button"
          onClick={stopRecording}
          className="px-4 py-2 rounded-full text-white font-medium bg-green-500 hover:bg-green-600"
        >
          완료
        </button>
      )}
    </div>
  );
}

export default IntegratedRoom;
