import { useEffect, useState } from "react";
import { useMessageScoreUpdate } from "../hooks/useScoreUpdate";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerFooter,
  DrawerDescription,
  DrawerTitle,
  DrawerHeader,
  DrawerContent,
  DrawerTrigger,
} from "./ui/drawer";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";

export const UpdateMessageStatusDrawer = ({ message}: any) => {
  const [isOpen,setIsOpen]=useState(false)

  const { updateMessageScore, loading: scoreLoading } = useMessageScoreUpdate();
  const [status, setStatus] = useState("");
  const [score, setScore] = useState<number | "">("");

  const handleScoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);

    setScore(value);
  };
  const handleScoreSubmit = async () => {
    if (typeof score === "number") {
      try {
        if(status=='PENDING')return;
        await updateMessageScore(message?.id, score, status);
        // No need to reload the page or navigate away
        setIsOpen(false);
      } catch (error) {
        console.error("Failed to update message:", error);
        toast.error("Failed to update message status");
      }
    }
  };

  // Remove the window.location.reload() and navigation

  useEffect(() => {
    if (message) {
      setScore(message.score || "");
      setStatus(message.status || "");
    }
  }, [message]);
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button>Update Message Status</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-lg">
            Update the message status for "{message?.body.slice(0, 10)}..."
          </DrawerTitle>
          <DrawerDescription>
            The message is from {message?.sender?.username} to{" "}
            {message?.receiver?.username}
          </DrawerDescription>
        </DrawerHeader>
        <div className="mb-4 p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="score" className="block text-xl font-semibold">
              Assign Points/Marks(0-10)
            </Label>
            <Input
              type="number"
              id="score"
              min={0}
              max={10}
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
        <DrawerFooter className="flex flex-row items-center justify-end">
          <Button onClick={handleScoreSubmit} disabled={scoreLoading}>{scoreLoading ? "Updating..." : "Update"}</Button>
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
