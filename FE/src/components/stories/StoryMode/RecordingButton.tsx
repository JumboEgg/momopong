import { useState, useEffect, useCallback } from 'react';
import { useStory } from '@/stores/storyStore';
import { RecordingButtonProps } from '../types/story';

function RecordingButton({
  characterType,
  storyIndex,
  onRecordingComplete,
}: RecordingButtonProps): JSX.Element {
  const [isRecording, setIsRecording] = useState(false); // 녹음중인지 여부
  const [timeLeft, setTimeLeft] = useState(20); // 남은 녹음 시간
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const { addRecording } = useStory();

  // 녹음 중지 함수
  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  }, [mediaRecorder]);

  useEffect(() => {
    if (isRecording && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (isRecording && timeLeft === 0) {
      stopRecording(); // 시간이 다되면 녹음 중지
    }
    return () => {};
  }, [isRecording, timeLeft]);

  // 녹음 시작
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = []; // 녹음 데이터를 저장할 배열

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(blob);

        // 녹음 데이터를 스토리에 추가
        addRecording(storyIndex, {
          characterType,
          audioUrl,
          timestamp: Date.now(),
        });
        onRecordingComplete();
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      setTimeLeft(20); // 타이머 초기화
    } catch (error) {
      // console.error('Failed to start recording:', error);
    }
  }, [addRecording, characterType, storyIndex, onRecordingComplete]);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* 녹음버튼 */}
      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-4 py-2 rounded-full ${
          isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
        } text-white font-bold transition-colors`}
      >
        {isRecording ? `녹음 중... (${timeLeft}초)` : '녹음 시작'}
      </button>
      {/* 진행바(녹음 중일 때만 표시) */}
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
