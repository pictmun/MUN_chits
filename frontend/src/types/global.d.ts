export type Message = {
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

export type Conversation = {
  id: string;
  messages: Message[];
};
