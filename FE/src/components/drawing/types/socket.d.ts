import { Socket } from 'socket.io-client';

export interface SocketContextType {
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  roomId: string | null;
  setRoomId: (id: string) => void;
  socketRef: React.MutableRefObject<Socket | null>;
}
