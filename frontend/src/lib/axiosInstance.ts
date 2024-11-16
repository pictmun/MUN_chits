import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "/api", // Relative path
  withCredentials: true, // Include cookies if needed
});
