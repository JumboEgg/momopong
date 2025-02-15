import { useState, useEffect, useCallback, useRef } from 'react';
import { useRoomStore } from '@/stores/roomStore';

interface IntegratedRoomProps {
  roomName: string;
  participantName: string;
  userRole: 'role2' | 'role1';
  isUserTurn: boolean;
  onRecordingComplete: (participantId: string, audioBlob?: Blob) => void;
  onRecordingStatusChange: (participantId: string, status: 'idle' | 'recording' | 'completed') => void;
}

function IntegratedRoom({
  roomName,
  participantName,
  userRole,
  isUserTurn,
  onRecordingComplete,
  onRecordingStatusChange,
}: IntegratedRoomProps) {
  const { room, participants, connectionError, connectToRoom, disconnectRoom } = useRoomStore();
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  // 녹음 시작
  const startRecording = useCallback(async () => {
    if (!isUserTurn || isRecording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

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
          onRecordingComplete(room.localParticipant.identity, audioBlob);
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);

      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }, 20000);
    } catch (error) {
      console.error('Recording failed', error);
      alert('마이크 접근에 실패했습니다.');
    }
  }, [isUserTurn, isRecording, room, onRecordingComplete]);

  // 녹음 중지
  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      setTimeLeft(20);
    }
  }, [mediaRecorder]);

  useEffect(() => {
    connectToRoom(roomName, participantName);
    return () => {
      disconnectRoom();
    };
  }, [roomName, participantName, connectToRoom, disconnectRoom]);

  if (connectionError) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        <span>연결 오류: {connectionError}</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 flex items-center gap-4">
      {participants.map(({ participant, trackPublication }) => (
        <div key={participant.identity} className="relative w-48 h-36 bg-gray-800 rounded-lg overflow-hidden">
          <video
            ref={(element) => {
              if (element && trackPublication) {
                trackPublication.attach(element);
              }
            }}
            autoPlay
            playsInline
            muted={participant === room?.localParticipant}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {isUserTurn && (
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-4 py-2 rounded-full text-white font-medium transition-colors ${
            isRecording ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isRecording ? `${timeLeft}초` : '녹음 시작'}
        </button>
      )}
    </div>
  );
}

export default IntegratedRoom;
