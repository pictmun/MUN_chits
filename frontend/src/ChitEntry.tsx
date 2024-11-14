import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type ChitEntryProps = {
  onSubmit: (chit: Chit) => void;
};

type Chit = {
  recipient: string;
  subject: string;
  message: string;
  sendViaBoard: boolean;
};

const ChitEntry: React.FC<ChitEntryProps> = ({ onSubmit }) => {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sendViaBoard, setSendViaBoard] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ recipient, subject, message, sendViaBoard });

    setRecipient('');
    setSubject('');
    setMessage('');
    setSendViaBoard(false);

    navigate('/inbox'); 
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">New Chit</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Recipient */}
        <div className="mb-4">
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">Recipient</label>
          <input
            type="text"
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        {/* Subject */}
        <div className="mb-4">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        {/* Message */}
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          ></textarea>
        </div>
        
        {/* Checkbox for sending via Board */}
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="sendViaBoard"
            checked={sendViaBoard}
            onChange={(e) => setSendViaBoard(e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="sendViaBoard" className="ml-2 text-sm text-gray-700">Send via Board</label>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Submit Chit
        </button>
      </form>
    </div>
  );
};

export default ChitEntry;
