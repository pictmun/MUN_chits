import { useEffect, useState } from "react";
import { toast } from "sonner";
import { axiosInstance } from "../lib/axiosInstance";

export const useGetConversation = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [conversations, setConversations] = useState<ConversationType[] | null>(
    null
  );

  useEffect(() => {
    const getConversations = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/message/get");
        if (!res.data.success) {
          throw new Error(res.data.error || "Failed to fetch conversations");
        }
        // console.log(res.data.messages);
        setConversations(res.data.messages);
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, []); // Add dependency array to ensure the effect runs only once

  return { conversations, loading };
};
