import { toast } from "sonner";
import { axiosInstance } from "../lib/axiosInstance";
import { useState } from "react";

export const useMessageScoreUpdate = () => {
const [loading, setLoading] = useState(false);
    const updateMessageScore = async (messageId: string, score: number) => {
        setLoading(true);
        try {
             await axiosInstance.patch(
              `admin/update-message-status/${messageId}`,
              { score }
            );
            toast.success("Message score updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred");
        }finally{
            setLoading(false);
        }
    };

    return { updateMessageScore, loading };
};