import React from 'react';
import { Link } from 'react-router-dom';

type Message = {
  id: number;
  sender: string;
  subject: string;
  timestamp: string;
  isUnread: boolean;
  message: string;
  sendViaEB: boolean;
};

type InboxProps = {
  messages: Message[];
  onMessageSelect: (message: Message) => void;
};

const Inbox: React.FC<InboxProps> = ({ messages, onMessageSelect }) => {
  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <header className="px-4 py-2 bg-gray-800 text-white font-semibold">Inbox</header>
      
      <ul className="divide-y divide-gray-200">
        {messages.map((message) => (
          <ListItem key={message.id} message={message} />
        ))}
      </ul>
    </div>
  );
};

type ListItemProps = {
  message: Message;
};

const ListItem: React.FC<ListItemProps> = ({ message }) => {
  return (
    <li className="flex items-center p-4 hover:bg-gray-100 cursor-pointer">
      
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-4">
        {message.sender.charAt(0)}
      </div>
      
      {/* Message Info */}
      <div className="flex-1">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-800">{message.sender}</span>
          <span className="text-xs text-gray-500">{message.timestamp}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">{message.subject}</span>
          {message.isUnread && (
            <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Unread</span>
          )}
        </div>
      </div>

      {/* Link to the ChitModal */}
      <Link to={`/chit/${message.id}`} onClick={() => message} />
    </li>
  );
};

export default Inbox;
