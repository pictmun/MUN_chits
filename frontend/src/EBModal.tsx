import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetchOneEbMessage } from "./hooks/useFetchOneEbMessage";
import { useMessageScoreUpdate } from "./hooks/useScoreUpdate";




const BoardModal = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [score, setScore] = useState<number | "">("");
  const { message, loading, fetchMessages } = useFetchOneEbMessage();
  const { updateMessageScore, loading: scoreLoading } = useMessageScoreUpdate();

  // Fetch the message based on the ID from URL
  useEffect(() => {
    if (id && !message) {
      fetchMessages(id);
    }
  }, [id, message, fetchMessages]);

  // If no message found, show "Chit not found" message
  if (loading) return <div>Loading...</div>;
  if (!message) {
    return <div>Chit not found</div>;
  }

  const handleClose = () => {
    navigate("/"); // Go back to the inbox
  };

  const handleScoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setScore(value === "" ? "" : parseInt(value));
  };

  const handleScoreSubmit = () => {
    if (typeof score === "number") {
      // Update the score via the updateMessageScore function
      updateMessageScore(message.id, score); // Call to update the score in the backend
      handleClose(); // Close the modal after submitting
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto bg-white shadow-lg rounded-lg p-6">
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
        <div className="text-sm text-gray-500">{message.createdAt}</div>
        <div className="text-lg font-semibold">{message.sender?.username}</div>
        {message.isViaEB && (
          <span className="mt-2 inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded-full">
            Reviewed by Board
          </span>
        )}
      </div>

      {/* Divider */}
      <hr className="my-4" />

      {/* Message Body */}
      <div className="text-gray-800 leading-relaxed whitespace-pre-line mb-4">
        {message.body}
      </div>

      {/* Points/Marks Section */}
      <div className="mb-6">
        <label
          htmlFor="score"
          className="block text-gray-700 font-semibold mb-2"
        >
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
          disabled={typeof score !== "number" || score <= 0}
          className="mt-3 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {scoreLoading ? "Submitting..." : "Submit Score"}
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
