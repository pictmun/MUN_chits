import { toast } from "sonner";

import { useState } from "react";
import { axiosInstance } from "../lib/axiosInstance";

export const useSendChit = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendChit = async (message: string,isViaEb: boolean, recipient: string) => {
    setIsLoading(true);
    try {
      console.log( isViaEb);
      const res = await axiosInstance.post(`/message/send/${recipient}`, {
        message,
        isViaEB:isViaEb
      });
      if (!res.data.success) {
        throw new Error(res.data.error || "Failed to send chit");
      }
      toast.success("Chit sent successfully");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return { sendChit, isLoading };
};
