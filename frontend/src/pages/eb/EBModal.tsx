import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMessageScoreUpdate } from "../../hooks/useScoreUpdate";
import { formatMessageTime } from "../../lib/utils";
import { Loading } from "../../components/Loading";
import { NoMessage } from "../../components/NoMessage";
import { useFetchOneEbMessage } from "../../hooks/useFetchOneEbMessage";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Select, SelectValue, SelectTrigger, SelectItem, SelectContent } from "../../components/ui/select";

const BoardModal = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchMessages, loading, message } = useFetchOneEbMessage();
  const { updateMessageScore, loading: scoreLoading } = useMessageScoreUpdate();
  const [status,setStatus]=useState("");
  const [score, setScore] = useState<number | "">("");

  useEffect(() => {
    if (id) fetchMessages(id);
  }, [id]);

  useEffect(() => {
    if (message && message.messages?.length > 0) {
      setScore(message.messages[0]?.score || "");
      setStatus(message.messages[0]?.status || "");
    }
  }, [message]);

  const handleClose = () => {
    navigate("/"); // Navigate back to the inbox
  };

  const handleScoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setScore(value === "" ? "" : parseInt(value, 10));
  };

  const handleScoreSubmit = () => {
    if (typeof score === "number" && message?.conversationId) {
      updateMessageScore(message?.messages[0]?.id, score,status); // Update score in the backend
      handleClose(); // Close the modal
    }
  };

  if (loading) {
    return <Loading classes="w-full h-full" />;
  }

  if (!message) {
    return <NoMessage />;
  }

  return (
    <div className="w-full bg-background p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Chit Details</h2>
        {message.messages?.[0]?.isViaEB && (
          <div className="bg-muted-foreground/10 font-semibold text-muted-foreground py-2 px-2.5 rounded-full">
            {message.messages?.[0]?.status}
          </div>
        )}
      </div>

      {/* Chit Info */}
      <div className="mb-4 flex  items-center justify-between">
        <div>
          <div className="text-lg font-semibold">
            <span className="mr-2 text-gray-500">Sender:</span>
            {message.sender?.username || "Unknown"}
          </div>
          <div className="text-lg font-semibold">
            <span className="mr-2 text-gray-500">Receiver:</span>
            {message.receiver?.username || "Unknown"}
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {formatMessageTime(message.createdAt)}
        </div>
      </div>
      {/* Divider */}
      <hr className="my-4" />

      {/* Message Body */}
      <div className=" leading-relaxed whitespace-pre-line mb-4">
        {message.messages?.map((msg: any) => (
          <p key={msg.id}>{msg.body}</p>
        ))}
      </div>

      {/* Points/Marks Section */}
      <div className="mb-4 flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Label htmlFor="score" className="block text-xl font-semibold">
            Assign Points/Marks
          </Label>
          <Input
            type="number"
            id="score"
            value={score}
            onChange={handleScoreChange}
            placeholder="Enter score"
            className="max-w-2xl px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="status" className="block text-xl font-semibold">
            Status
          </Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">PENDING</SelectItem>
              <SelectItem value="APPROVED">APPROVED</SelectItem>
              <SelectItem value="REJECTED">REJECTED</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-4 items-center justify-end">
        <Button
          onClick={handleScoreSubmit}
          disabled={scoreLoading}
          className="rounded-md focus:outline-none focus:ring-2"
        >
          {scoreLoading ? "Submitting..." : "Submit Score"}
        </Button>

        {/* Back Button */}
        <Button
          onClick={handleClose}
          className=" rounded-md focus:outline-none focus:ring-2 "
          variant={"outline"}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default BoardModal;
