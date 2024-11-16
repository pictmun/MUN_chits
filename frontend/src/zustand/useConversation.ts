import {create} from "zustand";
import { ConversationType } from "../types/global";




type MessageType = {
    id:string;
    body:string;
    senderId:string;
    // shouldShake:boolean
}
interface ConversationState {
    conversations: ConversationType|null;
    setConversations: (conversations: ConversationType|null) => void;
    messages: MessageType[]|null;
    setMessages: (messages: MessageType[]) => void;
}

export const useConversation = create<ConversationState>((set) => ({
    conversations:null,
    setConversations: (conversations) => set({ conversations: conversations }),
    messages:[],
    setMessages: (messages) => set({ messages }),
}));