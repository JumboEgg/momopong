import { useEffect } from 'react';
import { useRoomStore } from '@/stores/roomStore';
import { LocalParticipant, RemoteParticipant, Track } from "livekit-client";


interface IntegratedRoomProps {
  // roomName: string;
  // participantName: string;
  participants?: ParticipantTrack[];  // ✅ participants를 옵셔널로 변경
  userRole: 'role2' | 'role1';
  isUserTurn: boolean;
  onRecordingComplete: (participantId: string, audioBlob?: Blob) => void;
  onRecordingStatusChange: (participantId: string, status: 'idle' | 'recording' | 'completed') => void;
}


interface ParticipantTrack {
  participant: LocalParticipant | RemoteParticipant;
  trackPublication?: Track;
}

// 컴포넌트 인자
function IntegratedRoom({
  participants =[],
  userRole,
  isUserTurn,
  onRecordingComplete,
  onRecordingStatusChange,
  
}: IntegratedRoomProps) {
  const {
    room,
    isRecording,
    timeLeft,
    mediaRecorder,
    startRecording,
    stopRecording,
    broadcastRecordingStatus,
    updateParticipants
  } = useRoomStore();

  useEffect(() => {
    console.log("📢 IntegratedRoom participants 변경 감지ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ:", participants);
  }, [participants]);
  

  
  // Room 연결 설정
  // useEffect(() => {
  //   connectToRoom(roomName, participantName);

  //   return () => {
  //     if (room) {
  //       room.disconnect();
  //     }
  //   };
  // }, [roomName, participantName, connectToRoom, room]);


  // 데이터 수신 처리를 위한 effect
  useEffect(() => {
    if (!room) return;

    const handleDataReceived = (payload: Uint8Array) => {
      try {
        const message = JSON.parse(new TextDecoder().decode(payload));
        if (message.type === 'recording_status' && message.content.sender !== room.localParticipant.identity) {
          onRecordingStatusChange(message.content.sender, message.content.recordingStatus);
        }
      } catch (error) {
        console.error('데이터 처리 오류:', error);
      }
    };

    room.on('dataReceived', handleDataReceived);

    return () => {
      room.off('dataReceived', handleDataReceived);
    };
  }, [room, onRecordingStatusChange]);

  // 타이머 effect
  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (isRecording && timeLeft > 0) {
      timerId = setInterval(() => {
        if (timeLeft <= 1 && mediaRecorder?.state === 'recording') {
          stopRecording();
        }
      }, 1000);
    }

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [isRecording, timeLeft, mediaRecorder, stopRecording]);

  // if (connectionError) {
  //   return (
  //     <div className="p-4 bg-red-100 text-red-700 rounded-lg">
  //       <span>연결 오류: </span>
  //       <span>{connectionError}</span>
  //     </div>
  //   );
  // }

  const handleStartRecording = () => {
    if (!room) return;
    startRecording(isUserTurn, room, onRecordingComplete);
    broadcastRecordingStatus('recording');
  };

  const handleStopRecording = () => {
    stopRecording();
    broadcastRecordingStatus('completed');
  };

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
            onClick={handleStartRecording}
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
              onClick={handleStopRecording}
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

  //랜더링
  const renderParticipantVideo = (index: number) => {
    if (!participants[index]) {
      console.log("없나?")
      return null;
    }
    console.log("왜안돼!!");
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

  return (
    <div className="fixed bottom-8 right-8 flex items-center gap-4">
      <>
        {renderParticipantVideo(0)}
        {renderRecordingButton()}
        {renderParticipantVideo(1)}
      </>
  </div>
  );
}

export default IntegratedRoom;