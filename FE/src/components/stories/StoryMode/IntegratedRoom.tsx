// 수정한거임
import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import {
  Room,
  RoomEvent,
  RemoteParticipant,
  LocalParticipant,
  VideoPresets,
  Track,
} from 'livekit-client';
import { useRoomStore } from '@/stores/roomStore';

type VariantType = 'greeting' | 'story';

interface IntegratedRoomProps {
  roomName: string;
  participantName: string;
  userRole: 'role2' | 'role1';
  isUserTurn: boolean;
  onRecordingComplete: (participantId: string, audioBlob?: Blob) => void;
  onRecordingStatusChange: (participantId: string, status: 'idle' | 'recording' | 'completed') => void;
  variant?: VariantType; // 레이아웃 variant 추가
}

interface ParticipantTrack {
  participant: LocalParticipant | RemoteParticipant;
  trackPublication?: Track;
}

function IntegratedRoom({
  roomName,
  participantName,
  userRole,
  isUserTurn,
  onRecordingComplete,
  onRecordingStatusChange,
  variant = 'story',
}: IntegratedRoomProps) {
  const [participants, setParticipants] = useState<ParticipantTrack[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const {
    room,
    setRoom,
    confirmReady,
    setPartnerReady,
  } = useRoomStore();

  // 토큰 가져오기
  const getToken = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName, participantName }),
      });

      if (!response.ok) throw new Error('Failed to get token');
      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('Token error:', error);
      throw error;
    }
  }, [roomName, participantName]);

  // 참가자 목록 업데이트
  const updateParticipants = useCallback((currentRoom: Room) => {
    const participantTracks: ParticipantTrack[] = [];

    // 로컬 참가자 추가
    const localVideoPublication = currentRoom.localParticipant
      .getTrackPublications()
      .find((publication) => publication.kind === Track.Kind.Video);

    participantTracks.push({
      participant: currentRoom.localParticipant,
      trackPublication: localVideoPublication?.track,
    });

    // 원격 참가자 추가
    currentRoom.remoteParticipants.forEach((participant) => {
      const videoPublication = participant
        .getTrackPublications()
        .find((publication) => publication.kind === Track.Kind.Video);

      participantTracks.push({
        participant,
        trackPublication: videoPublication?.track,
      });
    });

    setParticipants(participantTracks);
  }, []);

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

      room.localParticipant
      .publishData(new TextEncoder().encode(JSON.stringify(message)), { reliable: true });

      onRecordingStatusChange(room.localParticipant.identity, status);
    },
    [room, onRecordingStatusChange],
  );

  // 녹음 시작
  const startRecording = useCallback(async () => {
    if (!isUserTurn || isRecording || !room) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // 새로운 MediaRecorder 생성 및 상태 업데이트
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
        audioBitsPerSecond: 128000,
      });

      const audioChunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });

        if (audioBlob.size > 0 && room) {
          // 녹음 완료 브로드캐스트
          broadcastRecordingStatus('completed');

          // 상위 컴포넌트에 녹음 완료 알림
          onRecordingComplete(room.localParticipant.identity, audioBlob);
        }

        // 스트림 정리
        stream.getTracks().forEach((track) => track.stop());
      };

      // mediaRecorder 상태 설정
      setMediaRecorder(recorder);

      recorder.start();
      setIsRecording(true);

      // 타이머 설정
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }, 20000);
    } catch (error) {
      console.error('Recording failed', error);
      alert('마이크 접근에 실패했습니다.');
    }
  }, [isUserTurn, room, broadcastRecordingStatus, onRecordingComplete]);

  // 녹음 중지
  const stopRecording = useCallback(() => {
    console.log('Stop Recording called', {
      isUserTurn,
      isRecording,
      mediaRecorderState: mediaRecorder?.state,
    });

    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      setTimeLeft(20);
    }
  }, [mediaRecorder, isUserTurn, isRecording]);

  // 20초 타이머를 위한 별도의 effect
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isRecording && mediaRecorder) {
      timeoutId = setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, 20000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isRecording, mediaRecorder]);

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
          // 오디오 설정 추가
          audioCaptureDefaults: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
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

        // 데이터 수신 처리
        newRoom.on(RoomEvent.DataReceived, (payload: Uint8Array) => {
          try {
            const message = JSON.parse(new TextDecoder().decode(payload));
            if (message.type === 'recording_status' && message.content.sender !== newRoom.localParticipant.identity) {
              onRecordingStatusChange(message.content.sender, message.content.recordingStatus);
            } else if (message.type === 'ready_status') {
              setPartnerReady(message.status);
            } else if (message.type === 'start_story') {
              confirmReady(message.status);
            }
          } catch (error) {
            console.error('데이터 처리 오류:', error);
          }
        });

        // 참가자 관련 이벤트 처리
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
          });

        await newRoom.connect(import.meta.env.VITE_LIVEKIT_URL, token);
        if (!isMounted) {
          await newRoom.disconnect();
          return;
        }

        await newRoom.localParticipant.setName(participantName);
    await newRoom.localParticipant.setCameraEnabled(true);

    if (variant === 'greeting') {
      await newRoom.localParticipant.setMicrophoneEnabled(true);
    }

    // 오디오 트랙 구독 이벤트 수정
    newRoom.on(RoomEvent.TrackSubscribed, (track) => {
      if (track.kind === Track.Kind.Audio) {
        track.attach();
      }
    });

    setRoom(newRoom);
    updateParticipants(newRoom);
  } catch (error) {
    console.error('Room connection error:', error);
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
        setRoom(null); // room 상태 초기화
      }
    };
  }, [roomName, participantName, getToken, updateParticipants, setRoom]);

  // 리소스 정리
  useEffect(
    () => () => {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    },
    [mediaRecorder],
  );

  // 타이머 effect 추가
  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (isRecording && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (mediaRecorder && mediaRecorder.state === 'recording') {
              mediaRecorder.stop();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [isRecording, timeLeft, mediaRecorder]);

  if (connectionError) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        <span>연결 오류: </span>
        <span>{connectionError}</span>
      </div>
    );
  }

  const renderRecordingButton = () => {
    // greeting 모드에서는 녹음 버튼을 렌더링하지 않음
    if (variant === 'greeting') {
      return null;
    }
    if (!isUserTurn) {
      return null;
    }

    return (
      <div className="flex flex-col items-center gap-2">
        {isRecording && (
          <div className="w-32 h-2 bg-gray-200 rounded mb-2">
            <div
              className="h-full bg-red-500 rounded transition-all duration-1000"
              style={{ width: `${(timeLeft / 20) * 100}%` }}
            />
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={startRecording}
            disabled={!isUserTurn || isRecording}
            className={`
              px-4 py-2 rounded-full text-white font-medium transition-colors whitespace-nowrap
              ${isRecording ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}
            `}
          >
            {isRecording ? `${timeLeft}초` : '녹음 시작'}
          </button>

          {isRecording && (
            <button
              type="button"
              onClick={stopRecording}
              className="px-4 py-2 rounded-full text-white font-medium bg-green-500 hover:bg-green-600 transition-colors whitespace-nowrap"
            >
              완료
            </button>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (room) {
      room.localParticipant.setMicrophoneEnabled(variant === 'greeting');
    }
  }, [variant, room]);

  const renderParticipantVideo = (index: number) => {
    if (!participants[index]) {
      return null;
    }

    const { participant, trackPublication } = participants[index];
    const isLocal = participant === room?.localParticipant;

    return (
      <div className="relative w-96 h-64 bg-gray-800 rounded-lg overflow-hidden">
        <video
          ref={(element) => {
            if (element && trackPublication) {
              trackPublication.attach(element);
            }
          }}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover"
        >
          <track kind="captions" />
        </video>

        <div className={`
          absolute bottom-2 left-2 right-2 
          flex justify-between items-center
          ${variant === 'greeting' ? 'bg-black bg-opacity-40 p-2 rounded' : ''}
        `}
        >
          <span className={`
            text-white truncate
            ${variant === 'greeting' ? 'text-base' : 'text-sm'}
          `}
          >
            <span>{participant.name || participant.identity}</span>
            {isLocal && <span>{` (${userRole === 'role2' ? '왕자님' : '신데렐라'})`}</span>}
          </span>
          {isLocal && (
            <div
              className={`w-2 h-2 rounded-full ${isUserTurn ? 'bg-green-500' : 'bg-red-500'}`}
              title={isUserTurn ? '내 차례' : '상대방 차례'}
            />
          )}
        </div>
      </div>
    );
  };
  // 방(화면)에 따른 레이아웃 변경
  if (variant === 'greeting') {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="grid grid-cols-2 gap-8 place-items-center">
          {renderParticipantVideo(0)}
          {renderParticipantVideo(1)}
        </div>
        <div className="mt-8 flex justify-center">
          {renderRecordingButton()}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 left-8 right-8 flex items-center justify-between">
      {renderParticipantVideo(0)}
      {renderRecordingButton()}
      {renderParticipantVideo(1)}
    </div>
  );
}

export default IntegratedRoom;
