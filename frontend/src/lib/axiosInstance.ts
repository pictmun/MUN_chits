import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://mun-chits.vercel.app/",
  withCredentials: true,
});


// "http://localhost:5000";