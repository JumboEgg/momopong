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

interface IntegratedRoomProps {
  roomName: string;
  participantName: string;
  userRole: 'prince' | 'princess';
  isUserTurn: boolean;
  onRecordingComplete: (participantId: string) => void;
  onRecordingStatusChange: (participantId: string, status: 'idle' | 'recording' | 'completed') => void;
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
}: IntegratedRoomProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<ParticipantTrack[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

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

      room.localParticipant.publishData(
        new TextEncoder().encode(JSON.stringify(message)),
        { reliable: true },
      );

      onRecordingStatusChange(room.localParticipant.identity, status);
    },
    [room, onRecordingStatusChange],
  );

  // 녹음 중지
  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
  }, [mediaRecorder]);

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

        // Clean up
        stream.getTracks().forEach((track) => track.stop());
        audioStreamRef.current = null;
        setMediaRecorder(null);
        setIsRecording(false);

        // Notify status changes
        broadcastRecordingStatus('completed');
        onRecordingComplete(room.localParticipant.identity);

        // Play recorded audio
        try {
          const audio = new Audio();
          audio.src = audioUrl;
          audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
          };

          audio.onerror = (e) => {
            console.error('Audio playback error:', e);
            URL.revokeObjectURL(audioUrl);
          };

          audio.play().catch((error) => {
            console.error('Failed to play audio:', error);
            URL.revokeObjectURL(audioUrl);
          });
        } catch (error) {
          console.error('Audio setup error:', error);
          URL.revokeObjectURL(audioUrl);
        }
      };

      setMediaRecorder(recorder);
      setIsRecording(true);
      setTimeLeft(20);
      recorder.start(1000);

      // Broadcast recording status
      broadcastRecordingStatus('recording');
      onRecordingStatusChange(room.localParticipant.identity, 'recording');
    } catch (error) {
      console.error('Recording failed:', error);
      alert('마이크 접근에 실패했습니다. 마이크 권한을 확인해주세요.');
      setIsRecording(false);
      broadcastRecordingStatus('idle');
    }
  }, [
    isUserTurn,
    isRecording,
    room,
    onRecordingComplete,
    onRecordingStatusChange,
    broadcastRecordingStatus]);

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

        // 데이터 수신 처리
        newRoom.on(RoomEvent.DataReceived, (payload: Uint8Array) => {
          try {
            const message = JSON.parse(new TextDecoder().decode(payload));
            if (message.type === 'recording_status' && message.content.sender !== newRoom.localParticipant.identity) {
              onRecordingStatusChange(message.content.sender, message.content.recordingStatus);
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
        await newRoom.localParticipant.setMicrophoneEnabled(false);

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

  if (connectionError) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        <span>연결 오류: </span>
        <span>{connectionError}</span>
      </div>
    );
  }

  const renderRecordingButton = () => {
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
              className="
                px-4 py-2 rounded-full text-white font-medium
                bg-green-500 hover:bg-green-600 transition-colors whitespace-nowrap
              "
            >
              완료
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderParticipantVideo = (index: number) => {
    if (!participants[index]) {
      return null;
    }

    const { participant, trackPublication } = participants[index];
    const isLocal = participant === room?.localParticipant;

    return (
      <div className="relative w-48 h-36 bg-gray-800 rounded-lg overflow-hidden">
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

        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
          <span className="text-white text-sm truncate">
            <span>{participant.name || participant.identity}</span>
            {isLocal && <span>{` (${userRole === 'prince' ? '왕자님' : '신데렐라'})`}</span>}
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

  return (
    <div className="fixed bottom-8 right-8 flex items-center gap-4">
      {renderParticipantVideo(0)}
      {renderRecordingButton()}
      {renderParticipantVideo(1)}
    </div>
  );
}

export default IntegratedRoom;
