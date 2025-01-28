import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import ChitModal from "./ChitModal";
import { useGetChit } from "../../hooks/useGetChit";
import { Loading } from "../../components/Loading";
import { NoMessage } from "../../components/NoMessage";
import { useSocketContext } from "../../context/SocketContext";
import { useConversation } from "../../zustand/useConversation";

const ChitModalWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { loading, chit, updateChit } = useGetChit(id!);
  const { socket } = useSocketContext();
const { addMessageToConversation } = useConversation();

useEffect(() => {
  if (!socket || !id || !chit?.messages?.[0]?.conversationId) return;

  const conversationId = chit.messages[0].conversationId;

  const handleReply = (message: string) => {
    try {
      const parsedMessage = JSON.parse(message);

      if (parsedMessage.conversationId === conversationId) {
        // Check if message already exists
        const messageExists = chit.messages.some(
          (msg:any) => msg.id === parsedMessage.id
        );

        if (messageExists) return;

        chit.messages.push(parsedMessage); 
        addMessageToConversation(parsedMessage.conversationId, parsedMessage);
        // Just push is enough!
      }
    } catch (error) {
      console.error("Error parsing reply in modal:", error);
    }
  };
  const handleStatusUpdate = (message: string) => {
    try {
      const parsedMessage = JSON.parse(message);
      if (parsedMessage.conversationId === conversationId) {
        updateChit((prevChit: any) => ({
          ...prevChit,
          messages: prevChit.messages.map((msg: any) =>
            msg.id === parsedMessage.id
              ? {
                  ...msg,
                  status: parsedMessage.status,
                  score: parsedMessage.score,
                }
              : msg
          ),
        }));
      }
    } catch (error) {
      console.error("Error parsing status update in modal:", error);
    }
  };

  socket.on("reply", handleReply);
  socket.on("messageStatusUpdated", handleStatusUpdate);

  return () => {
    socket.off("reply", handleReply);
    socket.off("messageStatusUpdated", handleStatusUpdate);
  };
}, [socket, id, chit?.messages, updateChit]);// ... existing code ...
  if (loading) return <Loading classes="w-full h-full" />;
  if (!id) {
    return (
      <div className="text-red-500">Invalid chit ID. Please try again.</div>
    );
  }
  if (!chit) {
    return <NoMessage />;
  }
  return <ChitModal messages={chit.messages} onUpdate={updateChit} />;
};

export default ChitModalWrapper;
