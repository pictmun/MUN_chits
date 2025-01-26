import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { useConversation } from "../zustand/useConversation";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { setConversations } = useConversation();

  useEffect(() => {
    if (!socket) return;
console.log("Socket connected:", socket?.connected);

    // Listen for new messages
    socket.on("newMessage", (message: any) => {
      const parsedMessage = JSON.parse(message);
      setConversations((prevConversations: any[]) => [
        parsedMessage,
        ...prevConversations,
      ]);
    });

    // Listen for message status updates
    socket.on("messageStatusUpdated", (message: any) => {
      const parsedMessage = JSON.parse(message);
      console.log("Message status updated:", parsedMessage);
      setConversations((prevConversations: any[]) => [
        parsedMessage,
        ...prevConversations,
      ]);
    });

    // Listen for replies
    socket.on("reply", (message: any) => {
      const parsedMessage = JSON.parse(message);
      setConversations((prevConversations: any[]) =>
        prevConversations.map((conversation) =>
          conversation.conversationId === parsedMessage.conversationId
            ? {
                ...conversation,
                messages: [...conversation.messages, ...parsedMessage.messages],
              }
            : conversation
        )
      );
    });

    // Clean up listeners
    return () => {
      socket.off("newMessage");
      socket.off("messageStatusUpdated");
      socket.off("reply");
    };
  }, [socket, setConversations]); // Remove `conversations` from the dependency array

  return null;
};

export default useListenMessages;
