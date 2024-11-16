import { useState } from "react"
import { useAuthContext } from "../context/AuthContext";
import { axiosInstance } from "../lib/axiosInstance";
import { toast } from "sonner";

export const useLogin = () => {
    const [isLoading,setIsLoading]=useState(false);
    const {setAuthUser}=useAuthContext();
    const login=async(username:string,password:string)=>{
        if(!username || !password){
            toast.error("All fields are required");
            return;
        }
        setIsLoading(true);
        try {
            const res=await axiosInstance.post('/auth/login',{username,password});
            if(!res.data.success){
                toast.error("Error in login");
                console.error(res.data.message);
                // throw new Error(res.data);
            }
            setAuthUser(res.data.user);
            toast.success("Login success");

        } catch (error:any) {
            console.error(error);
            toast.error(error.message);
        }finally{
            setIsLoading(false);
        }
    }
    return {login,isLoading}
}
