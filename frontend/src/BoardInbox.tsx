import React from 'react';
import { Link } from 'react-router-dom';
import { useFetchEbUserMessages } from './hooks/useFetchEbMessages';
import { formatMessageTime } from './lib/utils';
import useListenMessages from './hooks/useListenMessages';
import { useAuthContext } from './context/AuthContext';

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
  messages: any;
  onMessageSelect:any;
};

const BoardInbox: React.FC<InboxProps> = ({ onMessageSelect }) => {
  // Filter messages to show only those marked for Board review
  // const boardMessages = messages.filter((message) => message.sendViaEB);
   const { authUser } = useAuthContext();
   if (authUser) {
     useListenMessages();
   }
  const boardMessages=useFetchEbUserMessages()
  const sortBoardMessages=boardMessages.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return (
    <div className="w-[80%] max-w-xl shadow-md mx-auto rounded-lg overflow-hidden relative">
      <header className="px-4 py-2 bg-gray-800 text-white font-semibold">
        Board Inbox
      </header>

      <ul className="divide-y divide-gray-200">
        {sortBoardMessages.map((message: any) => (
          <ListItem
            key={message.id}
            message={message}
            onMessageSelect={onMessageSelect}
          />
        ))}
      </ul>
    </div>
  );
};

type ListItemProps = {
  message: any;
  onMessageSelect: (message: any) => void;
};

const ListItem: React.FC<ListItemProps> = ({ message, onMessageSelect }) => {
  return (
    <li className="">
      <Link
        to={`/eb/${message.id}`}
        onClick={() => onMessageSelect(message)}
        className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
      >
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-4">
          {message.sender.username.charAt(0)}
        </div>
        {/* Message Info */}
        <div className="flex-1">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">
              {message.sender.user}
            </span>
            <span className="text-xs text-gray-500">
              {formatMessageTime(message.createdAt)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">{message.body}</span>
            {/* {message.isUnread && (
            <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Unread</span>
          )} */}
          </div>
        </div>
        {/* Link to the ChitModal */}
      </Link>
    </li>
  );
};

export default BoardInbox;
