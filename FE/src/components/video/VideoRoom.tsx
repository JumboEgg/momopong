import { useLocation } from 'react-router-dom';
import {
 useState, useRef, useEffect, useCallback,
} from 'react';
import {
  LocalVideoTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
} from 'livekit-client';
import VideoComponent from './VideoComponent';
import AudioComponent from './AudioComponent';

type TrackInfo = {
  trackPublication: RemoteTrackPublication;
  participantIdentity: string;
};

// Constants
const APPLICATION_SERVER_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:8081/'
  : `https://${window.location.hostname}:6443/`;

const LIVEKIT_URL = window.location.hostname === 'localhost'
  ? 'ws://localhost:7880/'
  : `wss://${window.location.hostname}:7443/`;

function VideoRoom(): JSX.Element {
  const { state } = useLocation();
  const [currentRoom, setCurrentRoom] = useState<Room>();
  const [localTrack, setLocalTrack] = useState<LocalVideoTrack>();
  const [remoteTracks, setRemoteTracks] = useState<TrackInfo[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [gptResponse, setGptResponse] = useState('');
  const [roomName, setRoomName] = useState<string>(state?.roomName || 'Test Room');
  const [participantName, setParticipantName] = useState<string>(
    state?.participantName || 'Test Name',
  );

  const webSocket = useRef<WebSocket | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const processor = useRef<AudioWorkletNode | null>(null);
  const audioChunks = useRef<Uint8Array[]>([]);
  const recordingBlob = useRef<Blob | null>(null);
  const child_id = 1;

  const closeWebSocket = useCallback(() => {
    if (webSocket.current) {
      webSocket.current.close();
      webSocket.current = null;
    }
  }, []);

  const handleLeaveRoom = useCallback(async () => {
    if (currentRoom) {
      await currentRoom.disconnect();
      setCurrentRoom(undefined);
      setLocalTrack(undefined);
      setRemoteTracks([]);
    }
  }, [currentRoom]);

  const handleGetToken = useCallback(async (roomId: string, participantId: string) => {
    try {
      const response = await fetch(`${APPLICATION_SERVER_URL}token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName: roomId,
          participantName: participantId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Token request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('Token error:', error);
      throw error;
    }
  }, []);

  const setupWebSocket = useCallback(async () => {
    closeWebSocket();

    const ws = new WebSocket('ws://localhost:8081/api/book/letter/stt');

    ws.onopen = async () => {
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

        processor.current.port.onmessage = (event) => {
          if (webSocket.current?.readyState === WebSocket.OPEN) {
            webSocket.current.send(event.data);
            audioChunks.current.push(
              new Int16Array(event.data) as unknown as Uint8Array,
            );
          }
        };

        const analyser = audioContext.current.createAnalyser();
        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        source.connect(processor.current);
        processor.current.connect(audioContext.current.destination);
        source.connect(analyser);

        const detectTalking = () => {
          if (!webSocket.current) return;

          analyser.getByteFrequencyData(dataArray);
          requestAnimationFrame(detectTalking);
        };

        detectTalking();

        mediaRecorder.current.onstop = () => {
          if (processor.current && audioContext.current) {
            stream.getTracks().forEach((track) => track.stop());
            source.disconnect(processor.current);
            processor.current.disconnect(audioContext.current.destination);
          }
        };
      } catch (error) {
        console.error('Audio setup error:', error);
      }
    };

    ws.onmessage = (event) => {
      try {
        const receivedData = JSON.parse(event.data);
        if (receivedData.transcript) {
          setVoiceText(receivedData.transcript);
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
  }, [closeWebSocket]);

  const uploadToS3 = async (audioBlob: Blob): Promise<string> => {
    try {
      const presignedResponse = await fetch('http://localhost:8081/api/book/letter/presigned-url');

      if (!presignedResponse.ok) {
        throw new Error(`Failed to get presigned URL: ${presignedResponse.status}`);
      }

      const { presignedUrl, fileUrl } = await presignedResponse.json();

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

      return fileUrl;
    } catch (error) {
      console.error('S3 upload error:', error);
      throw error;
    }
  };

  const handleRecordClick = async () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setVoiceText('');
      setGptResponse('');
      await setupWebSocket();
    } else {
      if (mediaRecorder.current?.state === 'recording') {
        mediaRecorder.current.stop();
      }

      try {
        if (voiceText && recordingBlob.current) {
          const fileUrl = await uploadToS3(recordingBlob.current);

          const requestBody = {
            bookTitle: '흥부놀부',
            role: '흥부',
            childName: '은아',
            content: voiceText,
            letterRecord: fileUrl,
          };

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
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          if (data?.message) {
            setGptResponse(data.message);
          }
        }
        closeWebSocket();
      } catch (error) {
        console.error('Record processing error:', error);
        setGptResponse(`Error: ${(error as Error).message}`);
      }
    }
  };

  useEffect(() => {
    if (state?.roomName) setRoomName(state.roomName);
    if (state?.participantName) setParticipantName(state.participantName);
  }, [state]);

  useEffect(() => {
    let isMounted = true;

    const setupRoomEvents = (newRoom: Room) => {
      newRoom.on(RoomEvent.TrackSubscribed, (_track, publication, participant) => {
        if (!isMounted) return;
        setRemoteTracks((prev) => [
          ...prev,
          {
            trackPublication: publication,
            participantIdentity: participant.identity,
          },
        ]);
      });

      newRoom.on(RoomEvent.TrackUnsubscribed, (_track, publication) => {
        if (!isMounted) return;
        setRemoteTracks((prev) => prev.filter(
          (track) => track.trackPublication.trackSid !== publication.trackSid,
        ));
      });
    };

    const connectToRoom = async () => {
      if (!roomName || !participantName) return;

      try {
        const token = await handleGetToken(roomName, participantName);
        if (!isMounted) return;

        const newRoom = new Room({
          adaptiveStream: true,
          dynacast: true,
          stopLocalTrackOnUnpublish: true,
          publishDefaults: {
            videoEncoding: {
              maxBitrate: 2_500_000,
              maxFramerate: 30,
            },
          },
        });

        setupRoomEvents(newRoom);
        await newRoom.connect(LIVEKIT_URL, token);
        await newRoom.localParticipant.enableCameraAndMicrophone();

        if (!isMounted) {
          await newRoom.disconnect();
          return;
        }

        setCurrentRoom(newRoom);

        if (newRoom.localParticipant) {
          const videoTrack = Array.from(
            newRoom.localParticipant.videoTrackPublications.values(),
          )[0]?.videoTrack;
          if (videoTrack && isMounted) setLocalTrack(videoTrack);
        }
      } catch (error) {
        console.error('Room connection error:', error);
        if (isMounted) {
          await handleLeaveRoom();
        }
      }
    };

    connectToRoom();

    return () => {
      isMounted = false;
      handleLeaveRoom();
    };
  }, [roomName, participantName, handleGetToken, handleLeaveRoom]);

  return (
    <div id="room">
      <div id="room-header">
        <h2 id="room-title">{roomName}</h2>
        <button
          type="button"
          className="btn btn-danger"
          id="leave-room-button"
          onClick={handleLeaveRoom}
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
              bottom: '100px',
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
        {localTrack && (
          <VideoComponent
            track={localTrack}
            participantIdentity={participantName}
            local
          />
        )}
        {remoteTracks.map((remoteTrack) => (
          remoteTrack.trackPublication.kind === 'video' ? (
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
          )
        ))}
      </div>
    </div>
  );
}

export default VideoRoom;
