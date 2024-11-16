import { useState } from "react";
import { axiosInstance } from "../lib/axiosInstance";
import { useConversation } from "../zustand/useConversation";

export const useFetchOneEbMessage = () => {
    const {conversations:message,setConversations:setMessage}=useConversation();
    const [loading, setLoading] = useState(false);
    const fetchMessages = async (id: string) => {
        setLoading(true);
        try {
            const res=await axiosInstance.get(`/admin/get-message/${id}`);
            // console.log(res);
            setMessage(res.data);
            setLoading(false);
            
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }
    
    return {message,loading,fetchMessages};
};