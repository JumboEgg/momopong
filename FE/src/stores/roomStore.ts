import { create } from 'zustand';
import {
  Room,
  RoomEvent,
  RemoteParticipant,
  LocalParticipant,
  VideoPresets,
  Track,
} from 'livekit-client';

/**
 * 참가자 정보를 관리하는 인터페이스
 */
interface ParticipantTrack {
  participant: LocalParticipant | RemoteParticipant; // 참가자 (로컬 또는 원격)
  trackPublication?: Track; // 참가자의 영상 트랙 (옵션)
}

/**
 * Zustand 상태 관리를 위한 Room 상태 인터페이스
 */
interface RoomState {
  room: Room | null; // 현재 연결된 방
  participants: ParticipantTrack[]; // 참가자 목록
  connectionError: string | null; // 연결 오류 메시지

  currentPage: number; // 현재 페이지 상태 추가

  setRoom: (room: Room | null) => void; // 방 설정 함수
  updateParticipants: () => void; // 참가자 목록 업데이트 함수
  connectToRoom: (roomName: string, participantName: string) => Promise<void>; // 방 연결 함수
  disconnectRoom: () => void; // 방 연결 해제 함수

  // 페이지
  sendPageUpdate: (pageNumber: number) => void; // 페이지 업데이트 전송
  listenForPageUpdates: () => void; // 페이지 업데이트 수신
}

/**
 * Zustand를 이용한 LiveKit 방 상태 관리
 */
export const useRoomStore = create<RoomState>((set, get) => ({
  room: null, // 초기 방 상태는 없음
  participants: [], // 초기 참가자 목록은 빈 배열
  connectionError: null, // 초기 연결 오류 없음
  currentPage: 0, // 페이지 초기값


  /**
   * 방 객체를 설정하고 참가자 목록을 업데이트하는 함수
   */
  setRoom: (room) => {
    set({ room });
    if (room) {
      get().updateParticipants();
      get().listenForPageUpdates(); // 방 연결 후 페이지 업데이트 리스너 등록
    }
  },

  /**
   * 현재 방에 있는 참가자 목록을 업데이트하는 함수
   */
  updateParticipants: () => {
    const currentRoom = get().room;
    if (!currentRoom) return;

    const participantTracks: ParticipantTrack[] = [];

    // 로컬 참가자 추가 (본인)
    const localVideoPublication = currentRoom.localParticipant
      .getTrackPublications()
      .find((publication) => publication.kind === Track.Kind.Video);

    participantTracks.push({
      participant: currentRoom.localParticipant,
      trackPublication: localVideoPublication?.track,
    });

    // 원격 참가자 추가 (다른 참가자)
    currentRoom.remoteParticipants.forEach((participant) => {
      const videoPublication = participant
        .getTrackPublications()
        .find((publication) => publication.kind === Track.Kind.Video);

      participantTracks.push({
        participant,
        trackPublication: videoPublication?.track,
      });
    });

    set({ participants: participantTracks });
  },

  /**
   * LiveKit 방에 연결하는 함수
   * @param roomName - 방 이름
   * @param participantName - 참가자 이름
   */
  connectToRoom: async (roomName, participantName) => {
    try {
      // 백엔드에서 LiveKit 토큰 요청
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName, participantName }),
      });

      if (!response.ok) throw new Error('Failed to get token');
      const data = await response.json();
      const token = data.token;

      // LiveKit 방 객체 생성 및 설정
      const newRoom = new Room({
        adaptiveStream: true, // 네트워크 상태에 따라 자동으로 스트리밍 품질 조정
        dynacast: true, // 비디오 대역폭 최적화
        videoCaptureDefaults: {
          resolution: VideoPresets.h720.resolution, // 기본 해상도 720p 설정
        },
        publishDefaults: {
          simulcast: true, // 여러 해상도로 송출 (네트워크 상황 대응)
          videoEncoding: {
            maxBitrate: 2_500_000, // 최대 비트레이트 2.5Mbps
            maxFramerate: 30, // 최대 프레임 속도 30fps
          },
        },
      });

      // LiveKit 서버에 연결
      await newRoom.connect(import.meta.env.VITE_LIVEKIT_URL, token);

      // 참가자 정보 설정
      await newRoom.localParticipant.setName(participantName);
      await newRoom.localParticipant.setCameraEnabled(true); // 카메라 활성화
      await newRoom.localParticipant.setMicrophoneEnabled(false); // 마이크 비활성화

      // Zustand 상태 업데이트
      set({ room: newRoom });
      get().updateParticipants();
      get().listenForPageUpdates();
      // 참가자 및 트랙 관련 이벤트 리스너 등록
      newRoom.on(RoomEvent.ParticipantConnected, get().updateParticipants);
      newRoom.on(RoomEvent.ParticipantDisconnected, get().updateParticipants);
      newRoom.on(RoomEvent.TrackSubscribed, get().updateParticipants);
      newRoom.on(RoomEvent.TrackUnsubscribed, get().updateParticipants);
    } catch (error) {
      console.error('Room connection failed:', error);
      set({ connectionError: error instanceof Error ? error.message : 'Failed to connect' });
    }
  },

  /**
   * LiveKit 방 연결 해제 및 상태 초기화
   */
  disconnectRoom: () => {
    const room = get().room;
    if (room) {
      room.disconnect(); // LiveKit 연결 해제
    }
    set({ room: null, participants: [], connectionError: null });
  },

    /**
   * 페이지 변경 시 모든 참가자에게 전송하는 함수
   * 
   * ✅ 역할:
   * - 현재 참가자가 페이지를 변경하면 이 함수를 호출하여 
   *   방에 있는 모든 참가자들에게 변경된 페이지 정보를 브로드캐스트함.
   * - LiveKit의 `publishData()`를 사용하여 데이터를 전송.
   *
   * ✅ 작동 방식:
   * - 사용자가 "이전" 또는 "다음" 버튼을 클릭하면 실행됨.
   * - `room.localParticipant.publishData()`를 통해 메시지를 모든 원격 참가자들에게 전송.
   * - 전송된 데이터는 `listenForPageUpdates()`에서 수신하여 `currentPage` 상태를 업데이트함.
   *
   * @param {number} pageNumber - 변경된 페이지 번호
  */
    sendPageUpdate: (pageNumber) => {
      const room = get().room; // 현재 참가자가 속한 LiveKit 방 가져오기
      if (!room) return; // 방이 없으면 실행하지 않음 (안전 장치)
  
      const message = {
        type: 'page_update', // 메시지 타입을 "page_update"로 지정 (다른 메시지와 구분 가능)
        content: { pageNumber }, // 전송할 데이터 (변경된 페이지 번호)
      };
  
      // 모든 참가자에게 데이터 전송 (reliable: true는 데이터 손실 없이 보장됨)
      room.localParticipant.publishData(
        new TextEncoder().encode(JSON.stringify(message)), 
        { reliable: true }
      );
  
      console.log(`📨 페이지 업데이트 전송됨: ${pageNumber}`); // 디버깅 로그
    },
  
    /**
     * LiveKit 방에서 페이지 변경 데이터 수신하는 함수
     * 
     * ✅ 역할:
     * - 다른 참가자가 `sendPageUpdate(pageNumber)`를 호출하여 페이지 변경 데이터를 전송하면,
     *   이 함수를 통해 해당 데이터를 수신하고 `currentPage` 상태를 업데이트함.
     * - 즉, 방 안의 모든 참가자가 **동일한 페이지**를 유지할 수 있도록 동기화함.
     *
     * ✅ 작동 방식:
     * - LiveKit의 `RoomEvent.DataReceived` 이벤트를 리스닝함.
     * - 메시지가 수신되면 JSON으로 변환 후 `currentPage`를 업데이트.
     * - 모든 참가자가 변경된 페이지를 즉시 반영하도록 보장.
     */
    listenForPageUpdates: () => {
      const room = get().room;
      if (!room) return;
    
      room.on(RoomEvent.DataReceived, (payload) => {
        try {
          const message = JSON.parse(new TextDecoder().decode(payload));
    
          if (message.type === 'page_update') {
            console.log(`📥 페이지 업데이트 수신됨: ${message.content.pageNumber}`);
            
            // ✅ 페이지를 동기화하여 업데이트
            set({ currentPage: message.content.pageNumber });
          }
        } catch (error) {
          console.error('❌ 페이지 데이터 처리 오류:', error);
        }
      });
    
      console.log("👂 페이지 업데이트 수신 리스너 활성화됨");
    },
    
  
  
}));
