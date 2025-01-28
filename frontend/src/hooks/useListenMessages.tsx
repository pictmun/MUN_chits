import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { useConversation } from "../zustand/useConversation";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { setConversations } = useConversation();

  useEffect(() => {
    if (!socket) return;

    // 1. New Message Handler
    const handleNewMessage = (message: string) => {
      try {
        const parsedMessage = JSON.parse(message);
        setConversations((prevConversations: any[]) => {
          // Check if conversation already exists
          const existingConvIndex = prevConversations.findIndex(
            (conv) => conv.id === parsedMessage.id
          );

          if (existingConvIndex !== -1) {
            // Update existing conversation
            const updatedConversations = [...prevConversations];
            updatedConversations[existingConvIndex] = {
              ...updatedConversations[existingConvIndex],
              messages: [
                ...updatedConversations[existingConvIndex].messages,
                ...parsedMessage.messages,
              ],
            };
            return updatedConversations;
          } else {
            // Add new conversation
            return [parsedMessage, ...prevConversations];
          }
        });
      } catch (error) {
        console.error("Error parsing new message:", error);
      }
    };

    // 2. Reply Handler
    // 2. Reply Handler
    // 2. Reply Handler
    const handleReply = (message: string) => {
      try {
        const parsedMessage = JSON.parse(message);
        console.log("Received reply message:", parsedMessage);

        setConversations((prevConversations) => {
          const conversation = prevConversations.find(
            (conv) => conv.id === parsedMessage.conversationId
          );

          if (conversation) {
            // Check if message already exists
            const messageExists = conversation.messages.some(
              (msg) => msg.id === parsedMessage.id
            );

            if (!messageExists) {
              conversation.messages.push(parsedMessage);
            }
          }

          return prevConversations;
        });
      } catch (error) {
        console.error("Error parsing reply:", error);
      }
    };
    // 3. Status Update Handler
    const handleStatusUpdate = (message: string) => {
      try {
        const parsedMessage = JSON.parse(message);
        setConversations((prevConversations: any[]) =>
          prevConversations.map((conversation) =>
            conversation.id === parsedMessage.conversationId
              ? {
                  ...conversation,
                  messages: conversation.messages.map((msg: any) =>
                    msg.id === parsedMessage.id
                      ? {
                          ...msg,
                          status: parsedMessage.status,
                          score: parsedMessage.score,
                        }
                      : msg
                  ),
                }
              : conversation
          )
        );
      } catch (error) {
        console.error("Error parsing status update:", error);
      }
    };

    // Attach listeners
    socket.on("newMessage", handleNewMessage);
    socket.on("reply", handleReply);
    socket.on("messageStatusUpdated", handleStatusUpdate);

    // Cleanup
    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("reply", handleReply);
      socket.off("messageStatusUpdated", handleStatusUpdate);
    };
  }, [socket, setConversations]);

  return null;
};

export default useListenMessages;
