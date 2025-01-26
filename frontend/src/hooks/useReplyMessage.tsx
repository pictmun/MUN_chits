import { useState } from "react";
import { axiosInstance } from "../lib/axiosInstance";
import { toast } from "sonner";
import { useConversation } from "../zustand/useConversation";

export const useReplyMessage = (onLocalUpdate?: (message: any) => void) => {
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setConversations } = useConversation();

  const replyMessage = async (message: string, conversationId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if(!message || !conversationId){
        toast.error("All fields are required");
        return;
      }
      const res = await axiosInstance.post(`/message/reply/${conversationId}`, {
        message,
        isViaEb: false,
      });
      if (!res.data.success) {
        throw new Error(res.data.error || "Failed to send chit");
      }

      // Update Zustand store
      setConversations((prevConversations: any[]) =>
        prevConversations.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                messages: [...conversation.messages, res.data.data.messages[0]],
              }
            : conversation
        )
      );


      toast.success("Chit replied successfully");
    } catch (error: any) {
      console.error(error);
      setError(error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  return { replyMessage, loading, error };
};
