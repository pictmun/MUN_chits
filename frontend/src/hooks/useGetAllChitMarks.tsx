import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { axiosInstance } from "../lib/axiosInstance";
import { toast } from "sonner";

export const useGetAllChitMarks = () => {
  const [loading, setIsLoading] = useState(false);
  const { authUser } = useAuthContext();
  const [chitMarks, setChitMarks] = useState<any | null>(null);

  useEffect(() => {
    if (!authUser) {
      return;
    }

    const fetchChitMarks = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/admin/get-marks");
        if (response.data.success) {
          setChitMarks(response.data.data);
        } else {
          setChitMarks([]);
          throw new Error(response.data.error || "Failed to fetch chit marks");
        }
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChitMarks();
  }, [authUser]);

  return { chitMarks, loading };
};
