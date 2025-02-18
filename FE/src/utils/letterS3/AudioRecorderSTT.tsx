import { LetterInfo } from '@/types/letter';
import uploadLetterToS3 from '@/utils/letterS3/letterUpload';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconCircleButton } from '@/components/common/buttons/CircleButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { useRoleStore } from '@/stores/roleStore';
import { useBookContent } from '@/stores/book/bookContentStore';
import useSubAccountStore from '@/stores/subAccountStore';

function AudioRecorderSTT() {
  const { bookContent } = useBookContent();
  const {
    role1UserId,
  } = useRoleStore();

  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [error, setError] = useState('');
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);

  const webSocket = useRef<WebSocket | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const processor = useRef<AudioWorkletNode | null>();
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const [timeLeft, setTimeLeft] = useState(20);

  const navigate = useNavigate();

  // WebSocket 연결 및 STT 시작
  const setupWebSocket = async () => {
    if (webSocket.current) webSocket.current.close();

    const base_url = 'ws://localhost:8081/api/book/letter/stt';
    webSocket.current = new WebSocket(base_url);

    webSocket.current.onopen = async () => {
      try {
        const sampleRate = 16000;

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            sampleRate,
            channelCount: 1,
            echoCancellation: true,
          },
        });

        const options = {
          mimeType: 'audio/webm',
        };

        mediaRecorder.current = new MediaRecorder(stream, options);
        mediaRecorder.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.current.push(event.data);
          }
        };
        mediaRecorder.current.start();

        audioContext.current = new AudioContext({ sampleRate });
        await audioContext.current.audioWorklet.addModule(
          '/linear16-processor.js',
        );
        const source = audioContext.current.createMediaStreamSource(stream);
        processor.current = new AudioWorkletNode(
          audioContext.current,
          'linear16-processor',
        );

        // STT용 청크 처리
        processor.current.port.onmessage = (event) => {
          if (webSocket.current) {
            if (webSocket.current.readyState === WebSocket.OPEN) {
              webSocket.current.send(event.data);
            }
          }
        };

        const analyser = audioContext.current.createAnalyser();
        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        source.connect(processor.current);
        processor.current.connect(audioContext.current.destination);
        source.connect(analyser);

        const detectAudio = () => {
          if (!webSocket.current) return;

          analyser.getByteFrequencyData(dataArray);
          requestAnimationFrame(detectAudio);
        };
        detectAudio();

        mediaRecorder.current.onstop = () => {
          if (processor.current && audioContext.current) {
            const completeAudioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
            setRecordingBlob(completeAudioBlob);
            audioChunks.current = [];

            stream.getTracks().forEach((track) => track.stop());
            source.disconnect(processor.current);
            processor.current.disconnect(audioContext.current.destination);
          }
        };
      } catch (err) {
        console.log(err);
        setError('마이크 사용 권한을 확인해주세요.');
      }
    };

    webSocket.current.onmessage = (event) => {
      try {
        const receivedData = JSON.parse(event.data);
        if (receivedData.transcript) {
          setVoiceText(receivedData.transcript);
        }
      } catch (err) {
        console.error('Error parsing message:', err);
      }
    };

    webSocket.current.onerror = () => {
      console.error('WebSocket error:', error);
      setVoiceText('');
    };

    webSocket.current.onclose = () => {
      if (processor.current) {
        processor.current.disconnect();
        processor.current = null;
      }
      if (audioContext.current) {
        audioContext.current.close();
        audioContext.current = null;
      }
      if (mediaRecorder.current) {
        mediaRecorder.current.stop();
        mediaRecorder.current = null;
      }
    };
  };

  // 녹음 시작/중지 버튼
  const handleRecordClick = () => {
    if (isRecording) {
      mediaRecorder.current?.stop();
      setIsRecording(false);
      webSocket.current?.close();
    } else {
      setIsRecording(true);
      setupWebSocket();
    }
  };

  useEffect(() => {
    if (!recordingBlob) return;
    const myInfo = useSubAccountStore.getState().selectedAccount;

    const letter: LetterInfo = {
      bookTitle: bookContent?.bookTitle ?? '',
      role: role1UserId === myInfo?.childId ? bookContent?.role1 ?? '' : bookContent?.role2 ?? '',
      childName: myInfo?.name ?? '',
      content: voiceText,
      letterFileName: '',
      letterUrl: '',
      reply: '',
      createdAt: '',
    };

    const audioBlob = recordingBlob ?? new Blob();

    uploadLetterToS3({ letter, audioBlob });
    navigate('/home');
  }, [recordingBlob]);

  useEffect(() => {
    if (isRecording && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (isRecording && timeLeft === 0) {
      mediaRecorder.current?.stop();
      setIsRecording(false);
      webSocket.current?.close();
    }
    return () => {};
  }, [isRecording, timeLeft]);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* 녹음버튼 */}
      <IconCircleButton
        size="lg"
        variant="story"
        className=""
        hasFocus
        icon={<FontAwesomeIcon icon={faMicrophone} />}
        onClick={handleRecordClick}
      />
    </div>
  );
}

export default AudioRecorderSTT;
