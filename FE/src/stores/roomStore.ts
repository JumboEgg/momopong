import { create } from 'zustand';
import { Room } from 'livekit-client';

type RoomPhase = 'greeting' | 'story';

interface RoomState {
  isReady: boolean;
  isStoryStarted: boolean;
  partnerReady: boolean;
  room: Room | null;
  phase: RoomPhase;
  readyConfirmed: boolean; // 추가: 동화 시작 확정 상태

  setRoom: (room: Room | null) => void;
  setPhase: (phase: RoomPhase) => void;
  sendReadyStatus: (status: boolean) => void;
  setPartnerReady: (status: boolean) => void;
  confirmReady: (status: boolean) => void; // 추가: 동화 시작 확정 메서드
  resetReadyStatus: () => void; // 추가: 상태 초기화 메서드
  // syncRoomTransition: (payload: {
  //   roomName: string;
  //   participantName: string;
  //   timestamp: number;
  // }) => void;
}

export const useRoomStore = create<RoomState>((set, get) => ({
  isReady: false,
  phase: 'greeting',
  isStoryStarted: false,
  partnerReady: false,
  readyConfirmed: false,
  room: null,
  setReady: (status: boolean) => set({ isReady: status }),
  setStoryStarted: (status: boolean) => set({ isStoryStarted: status }),
  setRoom: (room: Room | null) => {
    console.log('🔄 Setting Room:', room ? {
      name: room.name,
      localParticipant: room.localParticipant.identity,
    } : 'null');
    set({ room });
  },

  setPhase: (phase: RoomPhase) => {
    set({ phase });

    // phase 변경 시 다른 참가자들에게 알림
    const { room } = get();
    if (room) {
      const message = {
        type: 'phase_change',
        phase,
        sender: room.localParticipant.identity,
        timestamp: Date.now(),
      };

      room.localParticipant.publishData(
        new TextEncoder().encode(JSON.stringify(message)),
        { reliable: true },
      );
    }
  },

  sendReadyStatus: (status: boolean) => {
    const { room } = get();
    if (room) {
      console.log('📤 Sending Ready Status:', {
        status,
        sender: room.localParticipant.identity,
      });

      const message = {
        type: 'ready_status',
        status,
        sender: room.localParticipant.identity,
      };

      console.log('📤 Preparing to send message:', message);

      try {
        const encodedMessage = new TextEncoder().encode(JSON.stringify(message));
        console.log('📦 Message encoded, attempting to publish...');

        room.localParticipant.publishData(encodedMessage, { reliable: true })
          .then(() => {
            console.log('✅ Message published successfully');
            set({ isReady: status });
          })
          .catch((error) => {
            console.error('❌ Failed to publish message:', error);
          });
      } catch (error) {
        console.error('❌ Error encoding/sending message:', error);
      }
    } else {
      console.warn('⚠️ Attempted to send ready status but room is null');
    }
  },

  setPartnerReady: (status: boolean) => {
    console.log('🔔 Setting Partner Ready:', {
      previousStatus: get().partnerReady,
      newStatus: status,
    });
    set({ partnerReady: status });
  },

  confirmReady: (status: boolean) => {
    console.log('🔔 Confirm Ready 호출', {
      status,
      currentState: get(),
    });

    // 명시적으로 상태 변경
    set({
      readyConfirmed: status,
      // isStoryStarted: status,
    });

    // 룸이 존재하는 경우 메시지 전송
    const { room } = get();
    if (room) {
      const message = {
        type: 'confirm_ready',
        status,
        sender: room.localParticipant.identity,
      };

      room.localParticipant.publishData(
        new TextEncoder().encode(JSON.stringify(message)),
        { reliable: true },
      );
    }
  },

  resetReadyStatus: () => {
    console.log('🔄 Resetting Ready Status');
    set({
      phase: 'greeting',
      isReady: false,
      partnerReady: false,
      readyConfirmed: false,
    });
  },

  // syncRoomTransition: (payload) => {
  //   const { room } = get();
  //   if (room) {
  //     const message = {
  //       type: 'room_transition',
  //       payload: {
  //         ...payload,
  //         sender: room.localParticipant.identity,
  //       },
  //     };

  //     room.localParticipant.publishData(
  //       new TextEncoder().encode(JSON.stringify(message)),
  //       { reliable: true },
  //     );
  //   }
  // },
}));
