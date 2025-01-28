import { create } from "zustand";
export const useConversation = create<any>((set) => ({
  conversations: [],
  setConversations: (conversations: any) =>
    set((state: any) => ({
      conversations: typeof conversations === "function" ? conversations(state.conversations) : conversations,
    })),
}));