import {
    LocalVideoTrack,
    RemoteParticipant,
    RemoteTrack,
    RemoteTrackPublication,
    Room,
    RoomEvent,
  } from 'livekit-client';
  import { useState, useRef } from 'react';

  type TrackInfo = {
    trackPublication: RemoteTrackPublication;
    participantIdentity: string;
  };

  let APPLICATION_SERVER_URL = '';
  let LIVEKIT_URL = '';

  function configureUrls() {
    console.log('Configuring URLs...');
    console.log('Current hostname:', window.location.hostname);
    console.log('Initial APPLICATION_SERVER_URL:', APPLICATION_SERVER_URL);

    if (!APPLICATION_SERVER_URL) {
      if (window.location.hostname === 'localhost') {
        APPLICATION_SERVER_URL = 'http://localhost:8081/';
      } else {
        APPLICATION_SERVER_URL = `https://${window.location.hostname}:6443/`;
      }
    }

    console.log('Final APPLICATION_SERVER_URL:', APPLICATION_SERVER_URL);

    if (!LIVEKIT_URL) {
      if (window.location.hostname === 'localhost') {
        LIVEKIT_URL = 'ws://localhost:7880/';
        // LIVEKIT_URL = "ws://localhost:6080/";
      } else {
        LIVEKIT_URL = `wss://${window.location.hostname}:7443/`;
      }
    }
  }

  configureUrls();

  function App() {
    const [room, setRoom] = useState<Room | undefined>(undefined);
    const [localTrack, setLocalTrack] = useState<LocalVideoTrack | undefined>(
      undefined,
    );
    const [remoteTracks, setRemoteTracks] = useState<TrackInfo[]>([]);
    const [participantName, setParticipantName] = useState(
      `Participant${Math.floor(Math.random() * 100)}`,
    );
    const [roomName, setRoomName] = useState('Test Room');
    const [isRecording, setIsRecording] = useState(false);
    const [voiceText, setVoiceText] = useState('');
    const webSocket = useRef<WebSocket>();
    // const setIsTalking = useState(false);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioContext = useRef<AudioContext | null>(null);
    const processor = useRef<AudioWorkletNode | null>();
    const audioChunks = useRef<Uint8Array[]>([]);
    const [gptResponse, setGptResponse] = useState('');
    const [finalTranscript, setFinalTranscript] = useState('');
    const [isComplete, setIsComplete] = useState(false); // 새로운 state 추가
    const child_id = 1; // 테스트용

    // 저장된 음성 듣기위해
    const [savedAudioUrl, setSavedAudioUrl] = useState<string>('');
    const [isSavedPlaying, setIsSavedPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const savedAudioRef = useRef<HTMLAudioElement | null>(null);

    // 녹음
    const recordingBlob = useRef<Blob | null>(null);

    // GPT 요청을 위한 인터페이스
    interface GPTRequest {
      fairyTale: string;
      role: string;
      childName: string;
      content: string;
      letterRecord?: string;
    }

    // S3 응답 인터페이스
    interface PresignedUrlResponse {
      presignedUrl: string;
      fileName: string;
    }

    const closeWebSocket = () => {
      if (webSocket.current) {
        webSocket.current.close();
      }
    };

    const setupWebSocket = async () => {
      closeWebSocket();

      // const ws = new WebSocket(`ws://localhost:6080/stt`);
      const ws = new WebSocket('ws://localhost:8081/api/book/letter/stt');

      ws.onopen = async () => {
        try {
          const sampleRate = 16000;
          // const chunkRate = 100;

          // STT용 스트림
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              sampleRate,
              channelCount: 1,
              echoCancellation: true,
            },
          });

          // S3 저장용 MediaRecorder 설정
          mediaRecorder.current = new MediaRecorder(stream);
          mediaRecorder.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
              recordingBlob.current = event.data;
            }
          };
          mediaRecorder.current.start(); // 전체 녹음 시작

          audioContext.current = new window.AudioContext({
            sampleRate,
          });

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

          const detectTalking = () => {
            if (!webSocket.current) {
              return;
            }

            analyser.getByteFrequencyData(dataArray);
            // const avgVolume =
            //   dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

            // if (avgVolume > 50) {
            //   setIsTalking(true);
            // } else {
            //   setIsTalking(false);
            // }

            requestAnimationFrame(detectTalking);
          };

          detectTalking();

          // 녹음 종료 시 cleanup
          mediaRecorder.current.onstop = () => {
            if (processor.current && audioContext.current) {
              stream.getTracks().forEach((track) => track.stop());
              source.disconnect(processor.current);
              processor.current.disconnect(audioContext.current.destination);
            }
          };

          // mediaRecorder.current.start(chunkRate);
        } catch (error) {
          console.error(error);
        }
      };

      ws.onmessage = (event) => {
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
              setIsComplete(true);
            }
          }
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setVoiceText('');
      };

      ws.onclose = () => {
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
      };

      webSocket.current = ws;
    };

    // S3 업로드 함수
    const uploadToS3 = async (audioBlob: Blob): Promise<string> => {
      try {
        const presignedResponse = await fetch(
          'http://localhost:8081/api/book/letter/presigned-url',
        );

        if (!presignedResponse.ok) {
          const errorText = await presignedResponse.text();
          console.error('Presigned URL Response:', {
            status: presignedResponse.status,
            statusText: presignedResponse.statusText,
            body: errorText,
          });
          throw new Error(
            `Failed to get presigned URL: ${presignedResponse.status}`,
          );
        }

        const { presignedUrl, fileName } = await presignedResponse.json();

        const uploadResponse = await fetch(presignedUrl, {
          method: 'PUT',
          body: audioBlob,
          headers: {
            'Content-Type': 'audio/wav',
          },
        });

        if (!uploadResponse.ok) {
          throw new Error(`Failed to upload to S3: ${uploadResponse.status}`);
        }

        return fileName;
      } catch (error) {
        console.error('S3 업로드 에러:', error);
        throw error;
      }
    };

    // 녹음 버튼 클릭 핸들러
    const handleRecordClick = async () => {
      setIsRecording(!isRecording);
      if (!isRecording) {
        // 녹음 시작
        setVoiceText('');
        setFinalTranscript('');
        setGptResponse('');
        setupWebSocket();
      } else {
        // 녹음 종료
        if (
          mediaRecorder.current
          && mediaRecorder.current.state === 'recording'
        ) {
          mediaRecorder.current.stop(); // 이것이 ondataavailable 이벤트를 트리거합니다
        }

        try {
          // Blob이 생성될 때까지 잠시 대기
          await new Promise((resolve) => setTimeout(resolve, 100));

          if (voiceText && recordingBlob.current) {
            // S3에 업로드
            const fileName = await uploadToS3(recordingBlob.current);
            console.log('Sending to GPT:', voiceText);

            const requestBody = {
              bookTitle: '흥부놀부',
              role: '흥부',
              childName: '은아',
              content: voiceText,
              letterFileName: fileName,
            };
            console.log('Request body:', JSON.stringify(requestBody, null, 2));

            // GPT API 호출
            const response = await fetch(
              `${APPLICATION_SERVER_URL}api/book/letter/gpt/${child_id}`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
              },
            );

            if (!response.ok) {
              const errorText = await response.text();
              console.error('Server error response:', errorText);
              throw new Error(
                `HTTP error! status: ${response.status}, message: ${errorText}`,
              );
            }

            const text = await response.text();
            console.log('서버 응답 원본:', text);

            if (!text) {
              throw new Error('Empty response from server');
            }

            const data = JSON.parse(text);
            if (data && data.message) {
              setGptResponse(data.message);
            } else {
              setGptResponse('응답 형식이 올바르지 않습니다.');
            }
          }
          closeWebSocket();
        } catch (error) {
          console.error('Error:', error);
          setGptResponse(`오류가 발생했습니다: ${(error as Error).message}`);
        }
      }
    };

    // 저장된 음성 파일 URL 가져오기
    const fetchSavedAudio = async () => {
      try {
        const response = await fetch(
          `${APPLICATION_SERVER_URL}api/profile/${child_id}/letter`,
        );
        if (!response.ok) {
          throw new Error('Failed to fetch letters');
        }

        const letters = await response.json();

        if (letters && letters.length > 0) {
          const latestLetter = letters[0];
          console.log('Trying to play audio from URL:', latestLetter.letterUrl);

          if (latestLetter.letterUrl) {
            const audioResponse = await fetch(latestLetter.letterUrl, {
              headers: {
                Accept: 'audio/wav,audio/*;q=0.9,*/*;q=0.8',
              },
            });

            if (!audioResponse.ok) {
              throw new Error('Failed to fetch audio file');
            }

            const arrayBuffer = await audioResponse.arrayBuffer();
            const audioBlob = new Blob([arrayBuffer], {
              type: audioResponse.headers.get('content-type') || 'audio/wav',
            });

            const url = URL.createObjectURL(audioBlob);

            // 기존 오디오 객체 정리 (에러 방지를 위해 수정)
            if (savedAudioRef.current) {
              savedAudioRef.current.pause();
              savedAudioRef.current = null;
            }

            // 새 오디오 객체 생성
            const audio = new Audio();
            audio.src = url;
            savedAudioRef.current = audio;
            setSavedAudioUrl(url);

            return url;
          }
        }
        return null;
      } catch (error) {
        console.error('Error fetching saved audio:', error);
        return null;
      }
  };
    async function joinRoom() {
      const room = new Room();
      setRoom(room);

      room.on(
        RoomEvent.TrackSubscribed,
        (
          _track: RemoteTrack,
          publication: RemoteTrackPublication,
          participant: RemoteParticipant,
        ) => {
          setRemoteTracks((prev) => [
            ...prev,
            {
              trackPublication: publication,
              participantIdentity: participant.identity,
            },
          ]);
        },
      );

      room.on(
        RoomEvent.TrackUnsubscribed,
        (_track: RemoteTrack, publication: RemoteTrackPublication) => {
          setRemoteTracks((prev) => prev.filter(
              (track) => track.trackPublication.trackSid !== publication.trackSid,
            ));
        },
      );

      try {
        const token = await getToken(roomName, participantName);
        await room.connect(LIVEKIT_URL, token);
        await room.localParticipant.enableCameraAndMicrophone();
        setLocalTrack(
          room.localParticipant.videoTrackPublications.values().next().value
            .videoTrack,
        );
      } catch (error) {
        console.log(
          'There was an error connecting to the room:',
          (error as Error).message,
        );
        await leaveRoom();
      }
    }

    async function leaveRoom() {
      await room?.disconnect();
      setRoom(undefined);
      setLocalTrack(undefined);
      setRemoteTracks([]);
    }

    async function getToken(roomName: string, participantName: string) {
      const response = await fetch(`${APPLICATION_SERVER_URL}token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName, participantName }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to get token: ${error.errorMessage}`);
      }

      const data = await response.json();
      return data.token;
    }

    return (
      <div>
        {!room ? (
          <div id="join">
            <div id="join-dialog">
              <h2>Join a Video Room</h2>
              <form
                onSubmit={(e) => {
                  joinRoom();
                  e.preventDefault();
                }}
              >
                <div>
                  <label htmlFor="participant-name">Participant</label>
                  <input
                    id="participant-name"
                    className="form-control"
                    type="text"
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="room-name">Room</label>
                  <input
                    id="room-name"
                    className="form-control"
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    required
                  />
                </div>
                <button
                  className="btn btn-lg btn-success"
                  type="submit"
                  disabled={!roomName || !participantName}
                >
                  Join!
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div id="room">
            <div id="room-header">
              <h2 id="room-title">{roomName}</h2>
              <button
                type="button"
                className="btn btn-danger"
                id="leave-room-button"
                onClick={leaveRoom}
              >
                Leave Room
              </button>
            </div>
            <div id="layout-container">
              <div
                style={{
                  position: 'fixed',
                  bottom: '60px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '4px',
                  display: voiceText ? 'block' : 'none',
                }}
              >
                {voiceText}
              </div>
              {gptResponse && (
                <div
                  style={{
                    position: 'fixed',
                    bottom: '100px', // voiceText보다 위에 표시
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '4px',
                    maxWidth: '80%',
                    width: '600px',
                  }}
                >
                  <strong>GPT 응답:</strong>
                  {' '}
                  {gptResponse}
                </div>
              )}
              <button
                type="button"
                style={{
                  position: 'fixed',
                  bottom: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  padding: '8px 16px',
                  backgroundColor: isRecording ? '#ff4444' : '#ffffff',
                  color: isRecording ? '#ffffff' : '#000000',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                onClick={handleRecordClick}
              >
                녹음
              </button>

              <button
                type="button"
                style={{
                  position: 'fixed',
                  bottom: '20px',
                  left: 'calc(50% + 200px)', // 이전 버튼들 오른쪽에 위치
                  transform: 'translateX(-50%)',
                  padding: '8px 16px',
                  backgroundColor: '#2196F3',
                  color: '#ffffff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                onClick={async () => {
                  try {
                    if (isSavedPlaying && savedAudioRef.current) {
                      savedAudioRef.current.pause();
                      savedAudioRef.current.currentTime = 0;
                      setIsSavedPlaying(false);
                    } else {
                      const url = await fetchSavedAudio();
                      if (url && savedAudioRef.current) {
                        await savedAudioRef.current.play();
                        setIsSavedPlaying(true);
                      }
                    }
                  } catch (error) {
                    console.error('Audio playback error:', error);
                    alert('음성 재생 중 오류가 발생했습니다.');
                  }
                }}
              >
                저장된 녹음
                {' '}
                {isSavedPlaying ? '정지' : '재생'}
              </button>

              {localTrack && (
                <VideoComponent
                  track={localTrack}
                  participantIdentity={participantName}
                  local
                />
              )}
              {remoteTracks.map((remoteTrack) => (remoteTrack.trackPublication.kind === 'video' ? (
                <VideoComponent
                  key={remoteTrack.trackPublication.trackSid}
                  track={remoteTrack.trackPublication.videoTrack!}
                  participantIdentity={remoteTrack.participantIdentity}
                />
                ) : (
                  <AudioComponent
                    key={remoteTrack.trackPublication.trackSid}
                    track={remoteTrack.trackPublication.audioTrack!}
                  />
                )))}
            </div>
          </div>
        )}
      </div>
    );
  }

  export default App;
