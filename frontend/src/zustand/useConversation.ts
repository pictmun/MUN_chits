import { create } from "zustand";

type Message = {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  senderId: string;
  conversationId: string;
  isReply: boolean;
  isViaEB: boolean;
  status: string;
  score: number;
  sender: {
    id: string;
    username: string;
  };
};

type Conversation = {
  id: string;
  messages: Message[];
};

type ConversationStore = {
  conversations: Conversation[];
  setConversations: (conversations: Conversation[] | ((prev: Conversation[]) => Conversation[])) => void;
};

export const useConversation = create<ConversationStore>((set) => ({
  conversations: [],
  setConversations: (conversations) =>
    set((state) => ({
      conversations: typeof conversations === "function" ? conversations(state.conversations) : conversations,
    })),
}));