import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { axiosInstance } from "../lib/axiosInstance";
import { toast } from "sonner";

export const useLogout = () => {
   const { setAuthUser } = useAuthContext();
   const [isLoading, setIsLoading] = useState(false);

   const logout = async () => {
      setIsLoading(true);
      try {
        const res=await axiosInstance.post("/auth/logout")
        if(!res.data.success){
            toast("Could not logout");
            return;
        }
        setAuthUser(null);
        toast.success("Logout success")
      } catch (error:any) {
        console.error(error.message)
      }finally{
        setIsLoading(false)
      }
   }
   return {logout,isLoading}
}
