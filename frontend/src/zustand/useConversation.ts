import {create} from "zustand";




// type MessageType = {
//     id:string;
//     body:string;
//     senderId:string;
//     // shouldShake:boolean
// }
// interface ConversationState {
//     conversations: ConversationType|null;
//     setConversations: (conversations: ConversationType|null) => void;
//     messages: MessageType[]|null;
//     setMessages: (messages: MessageType[]) => void;
// }

export const useConversation = create<any>((set) => ({
    conversations:[],
    setConversations: (conversations:any) => set({ conversations: conversations }),
    messages:[],
    setMessages: (messages:any) => set({ messages }),
}));