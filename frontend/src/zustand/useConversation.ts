import { create } from "zustand";
export const useConversation = create<any>((set) => ({
  conversations: [],
  setConversations: (conversations: any) =>
    set((state: any) => ({
      conversations:
        typeof conversations === "function"
          ? conversations(state.conversations)
          : conversations,
    })),
  addMessageToConversation: (conversationId: string, message:any) =>
    set((state: any) => ({
      conversations: state.conversations.map((conversation: any) =>
        conversation.id === conversationId
          ? { ...conversation, messages: [...conversation.messages, message] }
          : conversation
      ),
    })),
  addMessagesToEBConversation: (conversationId: string, message:any) =>
    set((state: any) => ({
    conversations: state.conversations.map((conversation: any) =>
      conversation.id === conversationId
        ? {
            ...conversation,
            messages: [...(conversation.messages || []), message], // ✅ Ensuring messages exist
          }
        : conversation
    ),
})),
}));