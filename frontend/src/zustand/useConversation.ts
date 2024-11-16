import {create} from "zustand";




type MessageType = {
    id:string;
    body:string;
    senderId:string;
    // shouldShake:boolean
}
interface ConversationState {
    selectedConversations: ConversationType|null;
    setConversations: (conversations: ConversationType|null) => void;
    messages: MessageType[]|null;
    setMessages: (messages: MessageType[]) => void;
}

export const useConversation = create<ConversationState>((set) => ({
    selectedConversations:null,
    setConversations: (conversations) => set({ selectedConversations: conversations }),
    messages:[],
    setMessages: (messages) => set({ messages }),
}));