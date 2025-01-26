import { create } from "zustand";
import { axiosInstance } from "../lib/axiosInstance";

export const useConversation = create<any>((set) => ({
  conversations: [], // Default to an empty array
  setConversations: (updateFn: any) =>
    set((state:any) => ({
      conversations:
        typeof updateFn === "function"
          ? updateFn(state.conversations)
          : updateFn,
    })),
  messages: [],
  setMessages: (messages: any) => set({ messages }),
  fetchConversations: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get("/message/get");
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch conversations"
        );
      }
      set({ conversations: response.data.conversations });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
}));
