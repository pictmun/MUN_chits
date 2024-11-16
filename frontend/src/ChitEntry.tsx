import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSendChit } from "./hooks/useSendChit";
import { useFetchRecipients } from "./hooks/useFetchReceipents";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { useSocketContext } from "./context/SocketContext";

const ChitEntry = () => {
  const [recipientId, setRecipientId] = useState("");
  const [message, setMessage] = useState("");
  const [isViaEb, setIsViaEb] = useState(false);
  const { sendChit, isLoading } = useSendChit();
  const { recipients, loading: recipientsLoading } = useFetchRecipients();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(recipientId, message,isViaEb);
      await sendChit(message,isViaEb, recipientId);
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setRecipientId("");
      setMessage("");
    }
  };
  const {onlineUsers} = useSocketContext()
  return (
    <Card className="max-w-xl w-full mx-auto bg-white shadow-md rounded-lg p-6">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold mb-4">New Chit</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        {/* Recipient Dropdown */}
        <CardContent>
          <div className="mb-4">
            <label
              htmlFor="recipient"
              className="block text-sm font-medium text-gray-700"
            >
              Recipient
            </label>
            <select
              id="recipient"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              required
              className="mt-1 py-3 px-3 block w-full border-2 border-black rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="" disabled>
                {recipientsLoading
                  ? "Loading recipients..."
                  : "Select a recipient"}
              </option>
              {recipients.map((user: any) => (
                <option key={user.id} value={user.id} className="flex justify-between items-center w-full">
                  {user.username} {/* or any identifier like email/name */}

                  {/* {onlineUsers.includes(user.id) && <span className="bg-green ml-2">Online</span>} */}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div className="mb-4">
            <label
              htmlFor="message"
              className="block  text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              placeholder="Enter your message..."
              className="mt-1 py-3 px-3 border-2 border-black block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            ></textarea>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="checkbox"
              id="via-eb"
              checked={isViaEb}
              onChange={() => setIsViaEb(!isViaEb)}
            />
            <label htmlFor="via-eb">Via EB</label>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center gap-3">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Submit Chit"}
          </button>
          <Link
            to="/"
            className="w-full block text-center  bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Back to Inbox
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ChitEntry;
