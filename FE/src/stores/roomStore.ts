import { useState, useRef, useCallback } from 'react';
import {
    Room,
    RoomEvent,
    RemoteParticipant,
    LocalParticipant,
    VideoPresets,
    Track,
  } from 'livekit-client';

interface RoomStore {
  room: Room | null;
  participants: ParticipantTrack[];
  isRecording: boolean;
  timeLeft: number;
  connectionError: string | null;
  mediaRecorder: MediaRecorder | null;
  audioStreamRef: React.MutableRefObject<MediaStream | null>;
  connectToRoom: (roomName: string, participantName: string) => Promise<void>;
  startRecording: (isUserTurn: boolean, room: Room, onRecordingComplete: (participantId: string, audioBlob?: Blob) => void) => void;
  stopRecording: () => void;
  broadcastRecordingStatus: (status: 'idle' | 'recording' | 'completed') => void;
  updateParticipants: (currentRoom: Room) => void;
}

interface ParticipantTrack {
  participant: LocalParticipant | RemoteParticipant;
  trackPublication?: Track;
}


export const useRoomStore = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<ParticipantTrack[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  // 토큰 가져오기
  const getToken = useCallback(async (roomName: string, participantName: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName, participantName }),
      });

      if (!response.ok) throw new Error('Failed to get token');
      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('Token error:', error);
      throw error;
    }
  }, []);

  // 참가자 목록 업데이트
  const updateParticipants = useCallback((currentRoom: Room) => {
    console.log("🔄 참가자 목록 업데이트 시도...");
    const participantTracks: ParticipantTrack[] = [];

    // 로컬 참가자 추가
    const localVideoPublication = currentRoom.localParticipant
      .getTrackPublications()
      .find((publication) => publication.kind === Track.Kind.Video);

    participantTracks.push({
      participant: currentRoom.localParticipant,
      trackPublication: localVideoPublication?.track,
    });
    console.log("🟢 로컬 참가자 추가됨:", currentRoom.localParticipant.name);
    // 원격 참가자 추가
    currentRoom.remoteParticipants.forEach((participant) => {
      console.log("🔵 원격 참가자 발견:", participant.name || participant.identity);

      const videoPublication = participant
        .getTrackPublications()
        .find((publication) => publication.kind === Track.Kind.Video);

      participantTracks.push({
        participant,
        trackPublication: videoPublication?.track,
      });
    });
    console.log("✅ 참가자 목록 업데이트 완료:", participantTracks);
    setParticipants(participantTracks);
  }, []);

  // 방 연결 설정
  const connectToRoom = useCallback(async (roomName: string, participantName: string) => {
    console.log("🚀 방 연결 시도! roomName:", roomName, "participantName:", participantName);
    try {
      const token = await getToken(roomName, participantName);

      const newRoom = new Room({
        adaptiveStream: true,
        dynacast: true,
        videoCaptureDefaults: {
          resolution: VideoPresets.h720.resolution,
        },
        publishDefaults: {
          simulcast: true,
          videoEncoding: {
            maxBitrate: 2_500_000,
            maxFramerate: 30,
          },
        },
      });

      // 데이터 수신 처리
      newRoom.on(RoomEvent.DataReceived, (payload: Uint8Array) => {
        try {
          const message = JSON.parse(new TextDecoder().decode(payload));
          if (message.type === 'recording_status' && message.content.sender !== newRoom.localParticipant.identity) {
            // 여기에 onRecordingStatusChange 처리 추가
          }
        } catch (error) {
          console.error('데이터 처리 오류:', error);
        }
      });

      // 참가자 관련 이벤트 처리
      newRoom
        .on(RoomEvent.ParticipantConnected, () => updateParticipants(newRoom))
        .on(RoomEvent.ParticipantDisconnected, () => updateParticipants(newRoom))
        .on(RoomEvent.TrackSubscribed, () => updateParticipants(newRoom))
        .on(RoomEvent.TrackUnsubscribed, () => updateParticipants(newRoom));

      await newRoom.connect(import.meta.env.VITE_LIVEKIT_URL, token);
      console.log("✅ 방 연결 성공!");
      setRoom(newRoom);
      updateParticipants(newRoom);
    } catch (error) {
      console.error('Room connection failed:', error);
      setConnectionError(error instanceof Error ? error.message : 'Failed to connect');
    }
  }, [getToken, updateParticipants]);

  // 녹음 시작
  const startRecording = useCallback(async (isUserTurn: boolean, room: Room, onRecordingComplete: (participantId: string, audioBlob?: Blob) => void) => {
    if (!isUserTurn || isRecording || !room) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // 새로운 MediaRecorder 생성 및 상태 업데이트
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
          // 녹음 완료 브로드캐스트
          // broadcastRecordingStatus 처리 추가

          // 상위 컴포넌트에 녹음 완료 알림
          onRecordingComplete(room.localParticipant.identity, audioBlob);
        }

        // 스트림 정리
        stream.getTracks().forEach((track) => track.stop());
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Recording failed', error);
      alert('마이크 접근에 실패했습니다.');
    }
  }, [isRecording]);

  // 녹음 중지
  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      setTimeLeft(20);
    }
  }, [mediaRecorder]);

  const broadcastRecordingStatus = useCallback((status: 'idle' | 'recording' | 'completed') => {
    if (!room) return;

    const message = {
      type: 'recording_status',
      content: {
        recordingStatus: status,
        sender: room.localParticipant.identity,
      },
    };

    room.localParticipant
      .publishData(new TextEncoder().encode(JSON.stringify(message)), { reliable: true });
  }, [room]);

  return {
    room,
    participants,
    isRecording,
    timeLeft,
    connectionError,
    mediaRecorder,
    audioStreamRef,
    connectToRoom,
    startRecording,
    stopRecording,
    broadcastRecordingStatus,
    updateParticipants,
  };
};
