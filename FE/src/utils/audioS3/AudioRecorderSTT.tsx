import { LetterInfo } from '@/types/letter';
import uploadLetterToS3 from '@/utils/audioS3/letterUpload';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AudioRecorderSTT() {
  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [error, setError] = useState('');
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);

  const webSocket = useRef<WebSocket | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const processor = useRef<AudioWorkletNode | null>();
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  // const recordingBlob = useRef<Blob | null>(null);

  const navigate = useNavigate();

  // WebSocket 연결 및 STT 시작
  const setupWebSocket = async () => {
    if (webSocket.current) webSocket.current.close();

    // TODO : 경로 변경 후 정상 동작 확인
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
          './linear16-processor.js',
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
        console.log('Received from server:', event.data);
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
      console.log('WebSocket closed');
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

      console.log('오디오 전송 종료');
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
    console.log(voiceText);

    const letter: LetterInfo = {
      bookTitle: '라이언 일병 구하기',
      role: '라이언 일병',
      childName: '김이병',
      content: voiceText,
      letterFileName: '',
      letterUrl: '',
      reply: '',
      createdAt: '',
    };

    const audioBlob = recordingBlob ?? new Blob();

    uploadLetterToS3({ letter, audioBlob });
  }, [recordingBlob]);

  const listenRecord = () => {
    // Blob URL 생성
    const blobUrl = URL.createObjectURL(recordingBlob);

    // Audio 객체 생성 및 재생
    new Audio(blobUrl).play();
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <button type="button" onClick={() => navigate('/home')}>홈으로 가기</button>
      <button type="button" onClick={handleRecordClick} style={{ padding: '10px 20px' }}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <button type="button" onClick={listenRecord}>녹음 듣기</button>
      <div style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold' }}>
        {isRecording ? voiceText : 'Click the button to start recording'}
      </div>
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
    </div>
  );
}

export default AudioRecorderSTT;
