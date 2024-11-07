import { createContext, useContext, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useAuthContext } from "./AuthContext";

interface ISocketContext {
  socket: Socket | null;
  onlineUsers: string[];
}
const SocketContext = createContext<ISocketContext | undefined>(undefined);
const socketUrl =
  import.meta.env.NODE === "development" ? "http://localhost:5000" : "/";

const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { authUser, isLoading } = useAuthContext();
  useEffect(() => {
    if (authUser && !isLoading) {
      const socket = io(socketUrl, {
        query: {
          userId: authUser.id,
        },
      });
      socketRef.current = socket;
      socket.on("getOnlineUsers", (users: string[]) => {
        setOnlineUsers(users);
      });
      return () => {
        socket.close();
        socketRef.current = null;
      };
    } else if (!authUser && !isLoading) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    }
  }, [authUser, isLoading]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = (): ISocketContext => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error(
      "useSocketContext must be used within a SocketContextProvider"
    );
  }
  return context;
};

export default SocketContextProvider;
