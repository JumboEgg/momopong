import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
// import { useFriends } from '@/stores/friendStore';

export interface DrawingData {
  status: string;
  color: string;
  prevX: number;
  prevY: number;
  curX: number;
  curY: number;
}

interface SocketStore {
  connect: boolean;
  isConnected: boolean; // 추가
  setConnect: (connected: boolean, invitation?: string) => void;
  roomId: string | null;
  setRoomId: (roomId: string | null) => void;
  socket: Socket | null;
  connectSocket: (invitationId?: string) => void;
  disconnectSocket: () => void;
}

// const DEFAULT_ROOM = 'ADSADWQ';

const useSocketStore = create<SocketStore>((set, get) => ({
  connect: false,
  isConnected: false, // 추가
  roomId: null,
  socket: null,

  setConnect: (connection: boolean, invitationId?: string) => {
    set({ connect: connection });

    if (connection) {
      get().connectSocket(invitationId);
    } else {
      get().disconnectSocket();
    }
  },

  setRoomId: (roomId: string | null) => {
    const { socket } = get();
    if (!socket || !roomId) return;

    const currentRoom = get().roomId;
    if (currentRoom && currentRoom !== roomId) {
      socket.emit('leave-room', currentRoom);
      console.info(`leave-room: ${currentRoom}`);
    }

    set({ roomId });
    socket.emit('join-room', roomId);
    console.info(`join-room: ${roomId}`);
  },

  connectSocket: (invitationId?: string) => {
    const { socket } = get();
    if (socket) return;

    const newSocket = io('wss://i12d103.p.ssafy.io', {
      transports: ['websocket', 'polling'],
      autoConnect: false,
    });

    newSocket.connect();

    newSocket.on('connect', () => {
      console.info('WebSocket 연결 성공!');
      set({ isConnected: true }); // 소켓 store 자체에서 상태 관리

      const roomId = invitationId ? `drawing_${invitationId}` : null;
      if (roomId) {
        set({ roomId });
        newSocket.emit('join-room', roomId);
        console.info(`join-room: ${roomId}`);
      }
    });

    newSocket.on('disconnect', () => {
      console.warn(' WebSocket 연결 종료');
      set({ socket: null, roomId: null, isConnected: false });
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const { socket, roomId } = get();
    if (!socket) return;

    if (roomId) {
      socket.emit('leave-room', roomId);
      console.info(`leave-room: ${roomId}`);
    }

    socket.disconnect();
    set({ socket: null, roomId: null, isConnected: false });
    console.warn('WebSocket 연결 종료');
  },
}));

export default useSocketStore;
