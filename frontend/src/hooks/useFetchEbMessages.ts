import { useEffect} from "react";
import { useAuthContext } from "../context/AuthContext";
import { axiosInstance } from "../lib/axiosInstance";
import { useConversation } from "../zustand/useConversation";
// axios.defaults.withCredentials = true;
export const useFetchEbUserMessages = () => {
  const {conversations,setConversations}=useConversation();
  const {  authUser } = useAuthContext();
  useEffect(() => {
    async function fetchMessages() {
      if (!authUser) {
        return;
      }
      const response = await axiosInstance.get("/admin/get-messages")
      if (response.data) {
        setConversations(response.data);
      } else {
        setConversations([]);
      }
    }
    fetchMessages();
  },[]);
  
  return conversations;
};
