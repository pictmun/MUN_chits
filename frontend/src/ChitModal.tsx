import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

type Message = {
  id: number;
  sender: string;
  subject: string;
  timestamp: string;
  message: string;
  sendViaEB: boolean;
  isUnread: boolean;
};

type ChitModalProps = {
  messages: Message[];
};

const ChitModal: React.FC<ChitModalProps> = ({ messages }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find the chit from the messages array based on the ID
  const chit = messages.find(msg => msg.id === parseInt(id!));

  if (!chit) {
    return <div>Chit not found</div>;
  }

  const handleClose = () => {
    navigate('/'); // Go back to the inbox
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Chit Details</h2>
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          Close
        </button>
      </div>

      {/* Chit Info */}
      <div className="mb-4">
        <div className="text-sm text-gray-500">{chit.timestamp}</div>
        <div className="text-lg font-semibold">{chit.sender}</div>
        <div className="text-md font-medium text-gray-700">{chit.subject}</div>
        {chit.sendViaEB && (
          <span className="mt-2 inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded-full">
            Reviewed by Board
          </span>
        )}
      </div>

      {/* Divider */}
      <hr className="my-4" />

      {/* Message Body */}
      <div className="text-gray-800 leading-relaxed whitespace-pre-line">
        {chit.message}
      </div>

      {/* Back Button */}
      <div className="mt-6">
        <button
          onClick={handleClose}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Inbox
        </button>
      </div>
    </div>
  );
};

export default ChitModal;
