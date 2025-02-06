import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

export interface drawingData {
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

const useSocketStore = create<SocketStore>((set, get) => {
  let socket: Socket | null = null;

  return {
    connect: false,
    setConnect: (connection) => {
      set({ connect: connection });
      if (connection) {
        get().connectSocket();
      } else {
        get().disconnectSocket();
      }
    },

    roomId: null,
    setRoomId: (roomId) => set({ roomId }),

    socket: null,

    connectSocket: () => {
      if (!socket) {
        socket = io('http://localhost:3869', { autoConnect: false });
        socket.connect();
        socket.on('connect', () => console.log('Connected to socket'));
        socket.on('disconnect', () => console.log('Disconnected from socket'));

        set({ socket });
      }
    },

    disconnectSocket: () => {
      if (socket) {
        socket.disconnect();
        socket = null;
        set({ socket: null });
      }
    },
  };
});

export default useSocketStore;
