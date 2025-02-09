import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

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
  setConnect: (connected: boolean) => void;
  roomId: string | null;
  setRoomId: (roomId: string | null) => void;
  socket: Socket | null;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

const DEFAULT_ROOM = 'ADSADWQ';

const useSocketStore = create<SocketStore>((set, get) => ({
  connect: false,
  roomId: null,
  socket: null,

  setConnect: (connection: boolean) => {
    set({ connect: connection });

    if (connection) {
      get().connectSocket();
      // 방에 입장
      get().setRoomId(DEFAULT_ROOM);
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

  // 소켓 연결 및 방 자동 입장
  connectSocket: () => {
    const { socket, roomId } = get();
    if (socket) return;

    const newSocket = io('wss://i12d103.p.ssafy.io', {
      transports: ['websocket', 'polling'],
      autoConnect: false,
    });

    newSocket.connect();

    newSocket.on('connect', () => {
      console.info(' WebSocket 연결 성공!');
      const activeRoom = roomId || DEFAULT_ROOM; // 기본 방이 없으면 "ADSADWQ"로 설정
      set({ roomId: activeRoom });
      newSocket.emit('join-room', activeRoom);
      console.info(` join-room: ${activeRoom}`);
    });

    newSocket.on('disconnect', () => {
      console.warn(' WebSocket 연결 종료');
      set({ socket: null, roomId: null });
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
    set({ socket: null, roomId: null });
    console.warn('WebSocket 연결 종료');
  },
}));

export default useSocketStore;
