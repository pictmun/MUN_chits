import { useEffect, useState } from "react";
import { toast } from "sonner";
import { axiosInstance } from "../lib/axiosInstance";
import { useConversation } from "../zustand/useConversation";

export const useGetConversation = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { conversations, setConversations } = useConversation();

  const fetchConversations = async () => {
    const res = await axiosInstance.get("/message/get");
    if (!res.data.success) {
      throw new Error(res.data.error || "Failed to fetch conversations");
    }
    return res.data.messages;
  };

  const refetch = async () => {
    try {
      setLoading(true);
      const messages = await fetchConversations();
      setConversations(messages);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const getConversations = async () => {
      try {
        setLoading(true);
        const messages = await fetchConversations();
        if (isMounted) {
          setConversations(messages);
        }
      } catch (error: any) {
        if (isMounted) {
          console.error(error);
          toast.error(error.message || "An unexpected error occurred");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getConversations();

    return () => {
      isMounted = false;
    };
  }, []);

  return { conversations, loading, refetch };
};
