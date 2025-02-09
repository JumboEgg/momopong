// interface RecordLetterProps {
//     webSocket: React.MutableRefObject<WebSocket | undefined>;
//     mediaRecorder: MediaRecorder | null;
// }

// const recordLetter = ({ webSocket, mediaRecorder }: RecordLetterProps) => {
//     const closeWebSocket = () => {
//         if (webSocket.current) {
//           webSocket.current.close();
//         }
//       };

//       const setupWebSocket = async () => {
//         closeWebSocket();

//         const ws = new WebSocket('ws://localhost:8081/api/book/letter/stt');

//         ws.onopen = async () => {
//           try {
//             const sampleRate = 16000;
//             // const chunkRate = 100;

//             // STT용 스트림
//             const stream = await navigator.mediaDevices.getUserMedia({
//               audio: {
//                 sampleRate,
//                 channelCount: 1,
//                 echoCancellation: true,
//               },
//             });

//             // S3 저장용 MediaRecorder 설정
//             // mediaRecorder.current = new MediaRecorder(stream);
//             mediaRecorder.ondataavailable = (event) => {
//               if (event.data.size > 0) {
//                 recordingBlob.current = event.data;
//               }
//             };
//             mediaRecorder.start(); // 전체 녹음 시작

//             audioContext.current = new window.AudioContext({
//               sampleRate,
//             });

//             await audioContext.current.audioWorklet.addModule(
//               './linear16-processor.js',
//             );

//             const source = audioContext.current.createMediaStreamSource(stream);
//             processor.current = new AudioWorkletNode(
//               audioContext.current,
//               'linear16-processor',
//             );

//             // STT용 청크 처리
//             processor.current.port.onmessage = (event) => {
//               if (webSocket.current) {
//                 if (webSocket.current.readyState === WebSocket.OPEN) {
//                   webSocket.current.send(event.data);
//                   audioChunks.current.push(
//                     new Int16Array(event.data) as unknown as Uint8Array,
//                   );
//                 }
//               }
//             };

//             const analyser = audioContext.current.createAnalyser();
//             analyser.fftSize = 256;
//             const dataArray = new Uint8Array(analyser.frequencyBinCount);

//             source.connect(processor.current);
//             processor.current.connect(audioContext.current.destination);
//             source.connect(analyser);

//             const detectTalking = () => {
//               if (!webSocket.current) {
//                 return;
//               }

//               analyser.getByteFrequencyData(dataArray);

//               requestAnimationFrame(detectTalking);
//             };

//             detectTalking();

//             // 녹음 종료 시 cleanup
//             mediaRecorder.onstop = () => {
//               if (processor.current && audioContext.current) {
//                 stream.getTracks().forEach((track) => track.stop());
//                 source.disconnect(processor.current);
//                 processor.current.disconnect(audioContext.current.destination);
//               }
//             };

//             // mediaRecorder.current.start(chunkRate);
//           } catch (error) {
//             console.error(error);
//           }
//         };

//         ws.onmessage = (event) => {
//           try {
//             console.log('Received from server:', event.data);
//             const receivedData = JSON.parse(event.data);
//             if (receivedData.transcript) {
//               // 임시 텍스트는 voiceText에만 저장
//               setVoiceText(receivedData.transcript);

//               // 최종 결과일 때만 finalTranscript 업데이트
//               if (receivedData.isFinal) {
//                 // 백엔드에서 isFinal flag 추가 필요
//                 setFinalTranscript(receivedData.transcript);
//                 setIsComplete(true);
//               }
//             }
//           } catch (error) {
//             console.error('Error parsing message:', error);
//           }
//         };

//         ws.onerror = (error) => {
//           console.error('WebSocket error:', error);
//           setVoiceText('');
//         };

//         ws.onclose = () => {
//           console.log('WebSocket closed');
//           if (processor.current) {
//             processor.current.disconnect();
//             processor.current = null;
//           }
//           if (audioContext.current) {
//             audioContext.current.close();
//             audioContext.current = null;
//           }
//           if (mediaRecorder.current) {
//             mediaRecorder.current.stop();
//             mediaRecorder.current = null;
//           }
//         };

//         webSocket.current = ws;
//       };
// };

// export default recordLetter;
