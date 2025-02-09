import { useEffect } from 'react';
import { useMultiplayStore } from '@/stores/multiplayStore';
/* eslint-disable import/no-extraneous-dependencies */
import { useRoomContext as useRoom, useParticipants } from '@livekit/components-react';
import { RoomEvent } from 'livekit-client';

// isHost 를 서버에 전송하는지 아닌지 물어보기
export function RoleManager() {
  const { setUserRole } = useMultiplayStore();
  const room = useRoom();
  const participants = useParticipants();

  useEffect(() => {
    let cleanup = () => {}; // 일관성 있도록 반환하기 위해 기본 cleanup 함수 선언

    if (room) {
      const allParticipants = [...participants, room.localParticipant];

      if (allParticipants.length > 2) {
        room.disconnect();
      } else if (allParticipants.length === 1) {
        const randomRole = Math.random() < 0.5 ? 'prince' : 'princess';
        setUserRole(randomRole);

        const data = JSON.stringify({ type: 'ROLE_ASSIGNED', role: randomRole });
        const encoder = new TextEncoder();
        const uint8Array = encoder.encode(data);

        room.localParticipant.publishData(uint8Array, { reliable: true });
      } else if (allParticipants.length === 2) {
        // 두 번째 참가자가 첫 번째 참가자의 반대 역할 담당하도록
        const handleData = (payload: Uint8Array) => {
          try {
            const decoder = new TextDecoder();
            const data = JSON.parse(decoder.decode(payload));
            if (data.type === 'ROLE_ASSIGNED') {
              const oppositeRole = data.role === 'prince' ? 'princess' : 'prince';
              setUserRole(oppositeRole);
            }
          } catch (error) {
            setUserRole(null);
          }
        };

        room.on(RoomEvent.DataReceived, handleData);
        cleanup = () => {
          room.off(RoomEvent.DataReceived, handleData);
        };
      }
    }

    return cleanup;
  }, [room, participants, setUserRole]);

  return null;
}
