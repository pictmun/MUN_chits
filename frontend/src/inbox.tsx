import React from "react";
import { Link } from "react-router-dom";
import { useConversation } from "./zustand/useConversation";
import {useGetConversation} from "./hooks/useGetConversation"
import { Message } from "./data/messages";
import { formatMessageTime } from "./lib/utils";
import { Loader2 } from "lucide-react";
// type Message = {
//   id: number;
//   sender: string;
//   subject: string;
//   timestamp: string;
//   isUnread: boolean;
//   message: string;
//   sendViaEB: boolean;
// };

type InboxProps = {
  messages: Message[];
  onMessageSelect: (message: Message) => void;
};

const Inbox: React.FC<InboxProps> = ({ messages, onMessageSelect }) => {
  // const { selectedConversations, setConversations, messages:mess, setMessages } =  useConversation()
  const { conversations, loading } = useGetConversation();
  // Sort conversations by timestamp
  const sortedConversations = Array.isArray(conversations)
    ? [...conversations].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];

  console.log(sortedConversations)
  if(loading){
    return <div className="w-screen h-screen z-10 bg-white ">
      <Loader2 className="size-30" />
    </div> 
      
  }
  return (
    <div className="w-[80%] max-w-xl shadow-md mx-auto rounded-lg overflow-hidden relative">
      <header className="px-4 py-2 bg-gray-800 text-white font-semibold">
        Inbox
      </header>
      {sortedConversations?.length == 0 && (
        <div className="p-4 text-gray-600">No messages to show</div>
      )}

      <ul className="divide-y divide-gray-200">
        {sortedConversations?.map((message) => (
          <ListItem key={message.id} message={message} />
        ))}
      </ul>
    </div>
  );
};

type ListItemProps = {
  message: any;
};
const ListItem: React.FC<ListItemProps> = ({ message }) => {
  return (
    <li>
     <Link
        to={`/chit/${message.id}`}
        onClick={() => message}
        className="flex items-center p-4 hover:bg-gray-100 cursor-pointer">
         <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-4">
           {message.sender?.username.charAt(0)}
       </div>

        <div className="flex-1">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">
              {message.sender?.username}
            </span>
            <span className="text-xs text-gray-500">{formatMessageTime(message.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">
              {message.body}
            </span>
            {/* {message.isUnread && (
              <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                Unread
              </span>
            )} */}
          </div>
        </div>
      </Link>
      {/* Link to the ChitModal */}
    </li>
  );
};

export default Inbox;
