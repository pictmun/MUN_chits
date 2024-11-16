import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { useConversation } from "../zustand/useConversation";

const useListenMessages = () => {
  const {socket}=useSocketContext();
  const {setConversations,conversations}=useConversation();
  useEffect(()=>{
      socket?.on("newMessage", (message:any) => {
        setConversations([JSON.parse(message),...conversations]);
      });
      socket?.on("messageStatusUpdated", (message:any) => {
        setConversations([JSON.parse(message),...conversations]);
      });
      
  },[socket])

}

export default useListenMessages