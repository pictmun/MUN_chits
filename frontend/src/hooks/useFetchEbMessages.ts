import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { axiosInstance } from "../lib/axiosInstance";
// axios.defaults.withCredentials = true;
export const useFetchEbUserMessages = () => {
  const [messages, setMessages] = useState([]);
  const {  authUser } = useAuthContext();
  useEffect(() => {
    async function fetchMessages() {
      if (!authUser) {
        setMessages([]);
      }
      const response = await axiosInstance.get("/admin/get-messages")
      if (response.data) {
        setMessages(response.data);
      } else {
        setMessages([]);
      }
    }
    fetchMessages();
  },[]);
  
  return messages;
};
