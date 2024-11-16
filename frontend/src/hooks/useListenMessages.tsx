import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { useConversation } from "../zustand/useConversation";
import { ConversationType } from "../types/global";

const useListenMessages = () => {
  const {socket}=useSocketContext();
  const {setConversations,conversations}=useConversation();
  useEffect(()=>{
      socket?.on("newMessage", (message: ConversationType) => {
        setConversations([JSON.parse(message),...conversations]);
      });
      socket?.on("messageStatusUpdated", (message: ConversationType) => {
        setConversations([JSON.parse(message),...conversations]);
      });
      
  },[socket])

}

export default useListenMessages