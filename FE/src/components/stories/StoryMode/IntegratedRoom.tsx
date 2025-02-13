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
  onRecordingComplete: () => void;
}

// 녹음 데이터 인터페이스 추가
interface RecordingData {
  characterType: 'prince' | 'princess';
  audioUrl: string;
  timestamp: number;
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
  const [globalRecordingStatus, setGlobalRecordingStatus] = useState<'idle' | 'recording' | 'completed'>('idle');

  // 녹음 상태 동기화를 위한 시그널 전송
  const broadcastRecordingStatus = useCallback((status: 'idle' | 'recording' | 'completed') => {
    if (!room) return;

    const data = {
      type: 'recording_status',
      status,
      sender: participantName,
    };

    room.localParticipant.publishData(
      new TextEncoder().encode(JSON.stringify(data)),
      { reliable: true },
    );
  }, [room, participantName]);

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
      // 녹음 시작 상태 브로드캐스트
      broadcastRecordingStatus('recording');
      setGlobalRecordingStatus('recording');

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

        const recordingData: RecordingData = {
          characterType: userRole,
          audioUrl,
          timestamp: Date.now(),
        };

        addRecording(currentIndex, recordingData);

        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);

        // 녹음 완료 상태 브로드캐스트
        broadcastRecordingStatus('completed');
        setGlobalRecordingStatus('completed');

        // 다음 페이지로 이동
        setTimeout(() => {
          onRecordingComplete();
        }, 1000);
      };

      setIsRecording(true);
      setTimeLeft(20);
      mediaRecorder.start();

      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, 20000);
    } catch (error) {
      console.error('녹음 시작 실패:', error);
      alert('마이크 접근에 실패했습니다. 마이크 권한을 확인해주세요.');
      setIsRecording(false);
      broadcastRecordingStatus('idle');
      setGlobalRecordingStatus('idle');
    }
  }, [
    isUserTurn,
    isRecording,
    currentIndex,
    userRole, addRecording, broadcastRecordingStatus, onRecordingComplete]);

  // 데이터 수신 이벤트 리스너 추가
  useEffect(() => {
    if (!room) return;

    const handleData = (payload: Uint8Array) => {
      try {
        const data = JSON.parse(new TextDecoder().decode(payload));
        if (data.type === 'recording_status' && data.sender !== participantName) {
          setGlobalRecordingStatus(data.status);
        }
      } catch (error) {
        console.error('데이터 처리 오류:', error);
      }
    };

    room.on(RoomEvent.DataReceived, handleData);

    // eslint-disable-next-line no-void
    void 0;
  }, [room, participantName]);

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

  // 상태 업데이트 전송
  const sendStoryState = useCallback((state: StoryState) => {
    if (!room) return;
    const data = JSON.stringify({ ...state, fromRole: userRole });
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    room.localParticipant.publishData(encodedData, { reliable: true });
  }, [room, userRole]);

  // 상태 변경 수신 처리
  const handleDataReceived = useCallback((payload: Uint8Array) => {
    try {
      const decoder = new TextDecoder();
      const data: StoryState = JSON.parse(decoder.decode(payload));

  if (data.fromRole === userRole) return;

  switch (data.type) {
    case 'STORY_UPDATE':
      if (typeof data.currentIndex === 'number' && typeof data.currentContentIndex === 'number') {
        onStoryUpdate(data.currentIndex, data.currentContentIndex);
      }
      break;
    case 'RECORDING_STATE':
      if (typeof data.isRecording === 'boolean') {
        onRecordingStateChange(data.isRecording);
      }
      break;
    default:
      break;
  }
} catch (error) {
  console.error('Data parsing error:', error);
}
  }, [onStoryUpdate, onRecordingStateChange, userRole]);

  // 비디오 트랙 가져오는 함수
  const getVideoTrack = useCallback((participant: RemoteParticipant | LocalParticipant) => {
    try {
      if (participant instanceof LocalParticipant) {
        const localTracks = Array.from(participant.videoTrackPublications.values());
        const cameraTrack = localTracks.find((publication) => publication.trackName === 'camera');
        console.log('Local video track:', cameraTrack);
        return cameraTrack?.track;
      }

  const remoteTracks = Array.from(participant.trackPublications.values());
  const videoPublication = remoteTracks.find(
    (publication) => publication.kind === Track.Kind.Video,
);
  console.log('Remote video track:', videoPublication);
  return videoPublication?.track;
} catch (error) {
  console.error('Error getting video track:', error);
  return null;
}
  }, []);

  // 참가자 상태 업데이트
  const updateParticipants = useCallback((currentRoom: Room) => {
    const remoteParticipants = Array.from(currentRoom.remoteParticipants.values());
    const allParticipants: (RemoteParticipant | LocalParticipant)[] = [...remoteParticipants];

if (currentRoom.localParticipant) {
  allParticipants.unshift(currentRoom.localParticipant);
}

setParticipants(allParticipants);
  }, []);

  // 상태 변경 시 동기화
  useEffect(() => {
    if (!room) return;
    sendStoryState({
      type: 'STORY_UPDATE',
      currentIndex,
      currentContentIndex,
    });
  }, [room, currentIndex, currentContentIndex, sendStoryState]);

  useEffect(() => {
    if (!room) return;
    sendStoryState({
      type: 'RECORDING_STATE',
      isRecording,
    });
  }, [room, isRecording, sendStoryState]);
>>>>>>> Stashed changes

  // LiveKit 룸 초기화
  useEffect(() => {
    let isMounted = true;

    const initRoom = async () => {
      try {
        // 토큰 가져오기
        const token = await handleGetToken(roomName, participantName);
        if (!isMounted) return;

        const roomOptions: RoomOptions = {
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

        newRoom
          .on(RoomEvent.ParticipantConnected, () => {
            if (isMounted) updateParticipants(newRoom);
          })
          .on(RoomEvent.ParticipantDisconnected, () => {
            if (isMounted) updateParticipants(newRoom);
          })
          .on(RoomEvent.DataReceived, (payload: Uint8Array) => {
            if (isMounted) handleDataReceived(payload);
          })
          .on(RoomEvent.Disconnected, (reason?: DisconnectReason) => {
            if (isMounted && reason) {
              setConnectionError(`Room disconnected: ${reason}`);
            }
          });

    await newRoom.connect(import.meta.env.VITE_LIVEKIT_URL, token);

    if (!isMounted) {
      await newRoom.disconnect();
      return;
    }

    await newRoom.localParticipant.setName(participantName);
    // 카메라와 마이크 초기화
    await newRoom.localParticipant.enableCameraAndMicrophone();
    await newRoom.localParticipant.setCameraEnabled(true);
    await newRoom.localParticipant.setMicrophoneEnabled(isUserTurn && audioEnabled);

    // 발행된 트랙이 있는지 확인
    const videoTracks = Array.from(newRoom.localParticipant.videoTrackPublications.values());
    if (videoTracks.length === 0) {
        console.warn('No camera track published after enabling camera');
    } else {
        console.log('Camera track published successfully');
    }

    setRoom(newRoom);
    updateParticipants(newRoom);
    } catch (error) {
    console.error('Failed to initialize media devices:', error);
    setConnectionError('카메라 또는 마이크 초기화에 실패했습니다.');
    }
};

initRoom();

return () => {
  isMounted = false;
  if (room) {
    room.disconnect();
  }
};
  },
  [roomName,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
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
                    try {
                    // 기존 연결 해제
                    videoTrack.detach().forEach((el) => el.remove());
                    // 새로운 연결
                    videoTrack.attach(element);
                    console.log('Video track attached:', participant.identity);
                    } catch (error) {
                    console.error('Error attaching video track:', error);
                    }
                } else {
                    console.log('No video track found for:', participant.identity);
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
                `(${userRole === 'prince' ? '왕자님' : '신데렐라'})`
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
>>>>>>> Stashed changes
          </div>
        );
      })}

      {/* 녹음 중 대기 상태 표시 */}
      {globalRecordingStatus === 'recording' && !isRecording && (
      <div className="absolute top-0 left-0 right-0 bg-yellow-100 text-yellow-800 p-2 text-center">
        상대방이 녹음 중입니다. 잠시만 기다려주세요...
      </div>
      )}
      {/* 녹음 버튼 - 상대방 녹음 중일 때는 비활성화 */}
      {isUserTurn && (
      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={globalRecordingStatus === 'recording' && !isRecording}
        className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full 
          ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} 
          text-white font-medium transition-colors
          ${globalRecordingStatus === 'recording' && !isRecording ? 'opacity-50 cursor-not-allowed' : ''}`}
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
