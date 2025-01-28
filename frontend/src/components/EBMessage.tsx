import { formatMessageTime } from "../lib/utils";
import { UpdateMessageStatusDrawer } from "./UpdateMessageStatusDrawer";

export const EBMessage = ({ message, conversationId }: any) => {
  return (
    <div className="p-2 border-b-2 border-b-muted ">
      <div className="flex justify-between items-center">
        <div className="flex flex-col items-start gap-0.5 text-lg">
          <p className="font-semibold">Sender:{message?.sender?.username}</p>
          <p className="font-semibold">Receiver:{message?.receiver?.username}</p>
        </div>
        <div className="py-2 px-2.5 rounded-full bg-muted-foreground/10 text-muted-foreground text-lg">{message?.status}</div>
      </div>
      <p className="text-sm mt-2 text-muted-foreground">{formatMessageTime(message?.createdAt)}</p>

      <p className="my-3 text-base font-medium">{message?.body}</p>
      <UpdateMessageStatusDrawer message={message} conversationId={conversationId} />
    </div>
  );
};

/**
 * 

 */
