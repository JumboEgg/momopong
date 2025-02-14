import { useState, useEffect, useCallback } from 'react';
import { useStory } from '@/stores/storyStore';

interface RecordingButtonProps {
  characterType: 'role2' | 'role1';
  storyIndex: number;
  onRecordingComplete: (audioUrl: string) => void;
  globalRecordingStatus: 'idle' | 'recording' | 'completed';
  isUserTurn: boolean;
}

function RecordingButton({
  characterType,
  storyIndex,
  onRecordingComplete,
  globalRecordingStatus,
  isUserTurn,
}: RecordingButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const { addRecording } = useStory();

  // 녹음 중지
  const stopRecording = useCallback(() => {
    if (!isRecording) return;
    setIsRecording(false);
    setTimeLeft(20);
  }, [isRecording]);

  // 녹음 시작
  const startRecording = useCallback(async () => {
    if (!isUserTurn || globalRecordingStatus === 'recording') {
      return;
    }

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

        addRecording(storyIndex, {
          characterType,
          audioUrl,
          timestamp: Date.now(),
        });

        onRecordingComplete(audioUrl);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTimeLeft(20);

      // 20초 후 자동 중지
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, 20000);
    } catch (error) {
      console.error('녹음 시작 실패:', error);
      alert('마이크 접근에 실패했습니다. 마이크 권한을 확인해주세요.');
    }
  }, [isUserTurn, globalRecordingStatus, characterType, storyIndex, addRecording, onRecordingComplete]);

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

  // 버튼 비활성화 조건
  const isButtonDisabled = !isUserTurn || globalRecordingStatus === 'recording' || !isUserTurn;

  // 버튼 스타일 계산
  const getButtonStyle = () => {
    if (isRecording) {
      return 'bg-red-500 hover:bg-red-600';
    }
    if (isButtonDisabled) {
      return 'bg-gray-400 cursor-not-allowed';
    }
    return 'bg-blue-500 hover:bg-blue-600';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isButtonDisabled}
        className={`px-4 py-2 rounded-full transition-colors ${getButtonStyle()} text-white font-bold`}
      >
        {isRecording ? `녹음 중... (${timeLeft}초)` : '녹음 시작'}
      </button>

      {isRecording && (
        <div className="w-full h-2 bg-gray-200 rounded">
          <div
            className="h-full bg-red-500 rounded transition-all duration-1000"
            style={{ width: `${(timeLeft / 20) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default RecordingButton;
