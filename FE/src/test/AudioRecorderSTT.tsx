import React, { useState, useRef } from 'react';
import { Mic, StopCircle } from 'lucide-react';

function BatchAudioSTT() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const processAudioData = async () => {
    if (audioChunks.current.length === 0) return;

    const audioBlob = new Blob(audioChunks.current, {
      type: 'audio/webm;codecs=opus',
    });

    try {
      const config = {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 48000,
        languageCode: 'ko-KR',
        enableAutomaticPunctuation: true,
      };

      const ws = new WebSocket('ws://localhost:8081/api/book/letter/stt');

      // Promise를 반환하여 WebSocket 통신이 완료될 때까지 기다림
      const data = new Promise((resolve, reject) => {
        // 연결이 열리면 순차적으로 데이터 전송
        ws.onopen = async () => {
          console.log('WebSocket 연결');
          try {
            // 먼저 설정 정보 전송
            ws.send(JSON.stringify({
              type: 'config',
              config,
            }));

            // 잠시 대기하여 서버가 설정을 처리할 시간을 줌
            await new Promise((rsv) => { setTimeout(rsv, 100); });

            // 그 다음 오디오 데이터 전송
            const arrayBuffer = await audioBlob.arrayBuffer();
            ws.send(arrayBuffer);
          } catch (err) {
            reject(err);
            ws.close();
          }
        };

        ws.onmessage = (event) => {
          console.log('응답 수신');
          try {
            const response = JSON.parse(event.data);
            console.log('서버 응답:', response);

            if (response.transcription) {
              setTranscription(response.transcription);
            }

            if (response.status === 'completed') {
              resolve(response);
              ws.close();
            }
          } catch (err) {
            console.error('응답 처리 중 에러:', err);
            reject(err);
          }
        };

        ws.onerror = (e) => {
          console.error('WebSocket 에러:', e);
          setError('서버 통신 중 에러가 발생했습니다.');
          reject(e);
        };

        ws.onclose = () => {
          console.log('WebSocket 연결 종료');
        };
      });
      console.log(data);
    } catch (err) {
      setError('오디오 변환 중 에러가 발생했습니다.');
      throw err;
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 48000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      const newMediaRecorder = new MediaRecorder(stream);

      newMediaRecorder.addEventListener('dataavailable', (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      });

      newMediaRecorder.addEventListener('stop', async () => {
        try {
          setIsProcessing(true);
          await processAudioData();
        } catch (err) {
          console.error('오디오 처리 중 에러:', err);
          setError('오디오 처리 중 에러가 발생했습니다.');
        } finally {
          setIsProcessing(false);
        }
      });

      mediaRecorder.current = newMediaRecorder;
      audioChunks.current = [];
      newMediaRecorder.start();
      console.log('start recording');
      setIsRecording(true);
      setError('');
      setTranscription('');
    } catch (err) {
      setError('마이크 접근 권한이 필요합니다.');
      console.error('녹음 시작 에러:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-4">
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`flex items-center gap-2 ${
            isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isRecording ? (
            <>
              <StopCircle className="w-4 h-4" />
              녹음 중지
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              녹음 시작
            </>
          )}
        </button>
      </div>

      {isProcessing && (
        <div>
          오디오 처리 중입니다...
        </div>
      )}

      {error || null}

      {transcription && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">변환된 텍스트:</h3>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
}

export default BatchAudioSTT;
