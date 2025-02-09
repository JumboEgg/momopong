import { LetterInfo } from '@/types/letter';
import uploadLetterToS3 from '@/utils/voiceS3/letterUpload';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function STTComponent() {
  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [error, setError] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');

  const webSocket = useRef<WebSocket | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const audioChunks = useRef<Uint8Array[]>([]);
  const processor = useRef<AudioWorkletNode | null>();
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordingBlob = useRef<Blob | null>(null);

  const navigate = useNavigate();

  // WebSocket 연결 및 STT 시작
  const setupWebSocket = async () => {
    if (webSocket.current) webSocket.current.close();

    webSocket.current = new WebSocket('ws://localhost:8081/api/book/letter/stt');

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

        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordingBlob.current = event.data;
          }
        };
        mediaRecorder.current.start();

        audioContext.current = new AudioContext({ sampleRate });
        await audioContext.current.audioWorklet.addModule(
          './linear16-processor.js', // 무슨 모듈...
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
              audioChunks.current.push(
                new Int16Array(event.data) as unknown as Uint8Array,
              );
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
          if (!webSocket.current) {
            return;
          }

          analyser.getByteFrequencyData(dataArray);
          requestAnimationFrame(detectAudio);
        };
        detectAudio();

        mediaRecorder.current.onstop = () => {
          if (processor.current && audioContext.current) {
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
          // 임시 텍스트는 voiceText에만 저장
          setVoiceText(receivedData.transcript);

          // 최종 결과일 때만 finalTranscript 업데이트
          if (receivedData.isFinal) {
            // 백엔드에서 isFinal flag 추가 필요
            setFinalTranscript(receivedData.transcript);
          }
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

      const letter: LetterInfo = {
        bookTitle: '흥부와 놀부',
        role: '흥부',
        childName: '놀부',
        content: finalTranscript,
        letterFileName: '',
        letterUrl: '',
        reply: '',
        createdAt: '',
      };

      const audioBlob = recordingBlob.current ?? new Blob();

      uploadLetterToS3({ letter, audioBlob });
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

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <button type="button" onClick={() => navigate('/Parent')}>리포트</button>
      <button type="button" onClick={handleRecordClick} style={{ padding: '10px 20px' }}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <div style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold' }}>
        {isRecording ? voiceText : 'Click the button to start recording'}
      </div>
      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
    </div>
  );
}

export default STTComponent;
