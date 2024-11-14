import React, { useState } from 'react';
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

type BoardModalProps = {
  messages: Message[];
  onScoreSubmit: (id: number, score: number) => void; // Callback to handle score submission
};

const BoardModal: React.FC<BoardModalProps> = ({ messages, onScoreSubmit }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [score, setScore] = useState<number | ''>('');

  // Find the chit from the messages array based on the ID
  const chit = messages.find(msg => msg.id === parseInt(id!));

  if (!chit) {
    return <div>Chit not found</div>;
  }

  const handleClose = () => {
    navigate('/'); // Go back to the inbox
  };

  const handleScoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setScore(value === '' ? '' : parseInt(value));
  };

  const handleScoreSubmit = () => {
    if (typeof score === 'number') {
      onScoreSubmit(chit.id, score); // Submit the score for the specific chit
      setScore(''); // Reset score input
      handleClose(); // Close the modal after submitting
    }
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
      <div className="text-gray-800 leading-relaxed whitespace-pre-line mb-4">
        {chit.message}
      </div>

      {/* Points/Marks Section */}
      <div className="mb-6">
        <label htmlFor="score" className="block text-gray-700 font-semibold mb-2">
          Assign Points/Marks
        </label>
        <input
          type="number"
          id="score"
          value={score}
          onChange={handleScoreChange}
          placeholder="Enter score"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleScoreSubmit}
          disabled={typeof score !== 'number'}
          className="mt-3 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Submit Score
        </button>
      </div>

      {/* Back Button */}
      <button
        onClick={handleClose}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Back to Inbox
      </button>
    </div>
  );
};

export default BoardModal;
