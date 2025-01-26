import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import ChitModal from "./ChitModal";
import { useGetChit } from "../../hooks/useGetChit";
import { Loading } from "../../components/Loading";
import { NoMessage } from "../../components/NoMessage";
import { useSocketContext } from "../../context/SocketContext";

const ChitModalWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { loading, chit, updateChit } = useGetChit(id!);
  const { socket } = useSocketContext();

  useEffect(() => {
    if (!socket || !id || !chit?.messages?.[0]?.conversationId) return;

    const conversationId = chit.messages[0].conversationId;

    const handleReply = (message: any) => {
      try {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.conversationId === conversationId) {
          updateChit(parsedMessage.messages[0]);
        }
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    };
    socket.on("reply", handleReply);

    return () => {
      socket.off("reply", handleReply);
    };
  }, [socket, id, chit?.messages?.[0]?.conversationId, updateChit]);

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
