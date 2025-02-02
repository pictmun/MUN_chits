import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSendChit } from "../../hooks/useSendChit";
import { useFetchRecipients } from "../../hooks/useFetchReceipents";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";

const ChitEntry = () => {
  const [recipientId, setRecipientId] = useState("");
  const [message, setMessage] = useState("");
  const [isViaEb, setIsViaEb] = useState<boolean>(false);
  const { sendChit, isLoading } = useSendChit();
  const { recipients, loading: recipientsLoading } = useFetchRecipients();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendChit(message, isViaEb, recipientId);
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setRecipientId("");
      setMessage("");
    }
  };

  return (
    <Card className="max-w-xl w-full border-0 shadow-none rounded-lg p-4">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl font-semibold mb-2">
          New Chit
        </CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        {/* Recipient Dropdown */}
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center gap-3 mb-2">
            <Checkbox
              id="via-eb"
              className="size-5"
              checked={isViaEb}
              onCheckedChange={() => setIsViaEb(!isViaEb)}
            />
            <Label htmlFor="via-eb" className="text-lg">
              Send message via EB
            </Label>
          </div>
          <div className="mb-4">
            <Label
              htmlFor="recipient"
              className="block  mb-2 text-base font-medium text-muted-foreground"
            >
              Recipient
            </Label>
            <Select onValueChange={setRecipientId} value={recipientId}>
              <SelectTrigger className="">
                <SelectValue
                  placeholder={
                    recipientsLoading
                      ? "Loading recipients..."
                      : "Select a recipient"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {recipients.map((user: any) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.portfolio}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div className="mb-4">
            <Label
              htmlFor="message"
              className="block  mb-2 text-base font-medium text-muted-foreground"
            >
              Message
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              placeholder="Enter your message..."
              className="max-h-80 resize-x-none p-3 border border-gray-300 rounded-md "
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center gap-3">
          <Button
            type="submit"
            disabled={isLoading}
            size={"lg"}
            className="text-base w-full md:w-fit"
          >
            {isLoading ? "Sending..." : "Submit Chit"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ChitEntry;
