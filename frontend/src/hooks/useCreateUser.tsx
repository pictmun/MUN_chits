import { toast } from "sonner";
import { axiosInstance } from "../lib/axiosInstance";
import { FormDataType } from "../pages/admin/CreateEntries"

export const useCreateUser = () => {
    const createUser = async (formData:FormDataType) => {
        try {

            const response = await axiosInstance.post("/admin/create", {username:formData.username,password:formData.password,portfolio:formData.portfolio,role:formData.role,committee:formData.committee,adminPass:"thisistheadminpassword"});
            if(response.data){
                toast.success("User created successfully");
            }
        } catch (error) {
            console.error(error);
        }
        
    }
    return {
        createUser}
}