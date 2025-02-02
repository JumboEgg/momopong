import React, {
  createContext, useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketContextType } from '../types/socket';

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const contextValue = useMemo(
    () => ({
      isConnected,
      setIsConnected,
      socketRef,
    }),
    [isConnected, socketRef],
  );

  useEffect(() => {
    if (isConnected) {
      socketRef.current = io('http://localhost:3869', { autoConnect: false });
      socketRef.current.connect();

      socketRef.current.on('connect', () => console.log('Connected'));
      socketRef.current.on('disconnect', () => console.log('Disconnected'));
    } else if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isConnected]);

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
}
