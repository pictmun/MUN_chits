import {  useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import { formatMessageTime } from "./lib/utils";



const ChitModal  = ({ messages }:{messages:any}) => {
  // const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find the chit from the messages array based on the ID

  const handleClose = () => {
    navigate("/"); // Go back to the inbox
  };

  return (
    <div className="max-w-xl w-full mx-auto bg-white shadow-lg rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Chit Details</h2>
        <Button variant={"destructive"} onClick={handleClose}>
          Close
        </Button>
      </div>

      {/* Chit Info */}
      <div className="mb-4">
        <div className="text-sm text-gray-500">{formatMessageTime(messages.createdAt)}</div>
        <div className="text-lg font-semibold">{messages.sender.username}</div>
      {messages.isViaEB && (
          <span className="mt-2 inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded-full">
            Reviewed by Board
          </span>
        )}
      </div>

      {/* Divider */}
      <hr className="my-4" />

      {/* Message Body */}
      <div className="text-gray-800 leading-relaxed whitespace-pre-line">
        {messages.body}
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
