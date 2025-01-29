import { Link } from "react-router-dom";
import { formatMessageTime } from "../lib/utils";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { NoMessage } from "./NoMessage";
import { Loading } from "./Loading";
const ITEMS_PER_PAGE = 15; // Number of items per page

export const BoardConversationList = ({
  sortedConversations,
  loading,
}: {
  sortedConversations: any;
  loading: boolean;
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(sortedConversations.length / ITEMS_PER_PAGE);
  // Paginate the conversations
  const paginatedConversations = sortedConversations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  if (loading) return <Loading classes="w-full h-full" />;
  if (!sortedConversations.length) return <NoMessage />;
  return (
    <>
      <ul className="border rounded-lg mx-auto w-[90%] md:w-full divide-y divide-y-muted-foreground max-w-4xl">
        {paginatedConversations.map((message: any) => (
          <ListItem key={message.id} conversation={message} />
        ))}
      </ul>
      {sortedConversations.length > ITEMS_PER_PAGE && (
        <div className="flex items-center w-full mx-auto max-w-4xl justify-end gap-4 mt-4">
          <Button
            variant={"outline"}
            size={"icon"}
            className=" bg-muted rounded-lg text-primary disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ArrowLeft className=" h-4 w-4" />
          </Button>
          <span className="text-muted-foreground text-sm">{currentPage}</span>
          <Button
            variant={"outline"}
            size={"icon"}
            className=" bg-muted rounded-lg text-primary disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <ArrowRight className=" h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
};
type ListItemProps = {
  conversation: any;
};

const ListItem: React.FC<ListItemProps> = ({ conversation }) => {
  const latestMessage = conversation.messages?.sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];
  return (
    <li>
      <Link
        to={`/eb/${conversation.conversationId}`}
        className="flex items-center p-4 hover:bg-muted cursor-pointer"
      >
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-primary font-bold mr-4">
          {latestMessage?.sender?.username?.charAt(0) || "?"}
        </div>

        <div className="flex-1">
          <div className="flex justify-between">
            <span className="font-semibold text-primary text-xl">
              {latestMessage?.sender?.username || "Unknown Sender"}
            </span>
            <span className="text-xs text-muted-foreground">
              {latestMessage?.createdAt
                ? formatMessageTime(latestMessage?.createdAt)
                : "No Date"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-muted-foreground text-sm line-clamp-2">
              {latestMessage?.body || "No message available"}
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
};
