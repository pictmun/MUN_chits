import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axiosInstance";

export const useFetchRecipients = () => {
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecipients = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/message/conversations");
        setRecipients(res.data);
      } catch (error) {
        console.error("Error fetching recipients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipients();
  }, []);

  return { recipients, loading };
};
