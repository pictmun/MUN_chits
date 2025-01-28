import { useFetchEbUserMessages } from '../../hooks/useFetchEbMessages';
import useListenMessages from '../../hooks/useListenMessages';
import { useAuthContext } from '../../context/AuthContext';
import { BoardConversationList } from '../../components/BoardConversationList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Loading } from '../../components/Loading';
const BoardInbox= () => {
  const { authUser } = useAuthContext();
  if (authUser) {
    useListenMessages();
  }

  const boardMessages = useFetchEbUserMessages();
  const sortedConversations = Array.isArray(boardMessages)
    ? [...boardMessages]
        .filter((conversation) => conversation.messages?.length > 0) // Exclude conversations with no messages
        .sort((a, b) => {
          const latestMessageA = a.messages.reduce(
            (latest: any, message: any) => {
              return new Date(message.createdAt).getTime() >
                new Date(latest.createdAt).getTime()
                ? message
                : latest;
            },
            a.messages[0]
          );

          const latestMessageB = b.messages.reduce(
            (latest: any, message: any) => {
              return new Date(message.createdAt).getTime() >
                new Date(latest.createdAt).getTime()
                ? message
                : latest;
            },
            b.messages[0]
          );

          return (
            new Date(latestMessageB?.createdAt).getTime() -
            new Date(latestMessageA?.createdAt).getTime()
          );
        })
    : [];

  const pendingConv = sortedConversations.filter((conversation: any) =>
    conversation.messages.some((message:any) => message.status === "PENDING")
  );

  const approvedConv = sortedConversations.filter((conversation: any) =>
    conversation.messages.every((message:any) => message.status === "APPROVED")
  );

  const rejectedConv = sortedConversations.filter(
    (conversation: any) =>
      conversation.messages.some((message:any) => message.status === "REJECTED") &&
      !conversation.messages.some((message:any) => message.status === "PENDING")
  );

  // ... existing code ...
  if (!boardMessages) {
    return <Loading classes="w-full h-full" />;
  }
  return (
    <div className="p-5 w-full">
      <div className="mb-5 flex flex-col items-start justify-center gap-2">
        <h2 className="text-2xl md:text-3xl font-semibold">Inbox</h2>
        <p className="text-muted-foreground text-sm">
          {boardMessages?.length > 0
            ? `You have ${boardMessages?.length} conversations in your inbox`
            : "You have no conversations in your inbox"}
        </p>
      </div>
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending Chits</TabsTrigger>
          <TabsTrigger value="approved">Approved Chits</TabsTrigger>
          <TabsTrigger value="rejected">Rejected Chits</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <BoardConversationList sortedConversations={pendingConv} />
        </TabsContent>
        <TabsContent value="approved">
          <BoardConversationList sortedConversations={approvedConv} />
        </TabsContent>
        <TabsContent value="rejected">
          <BoardConversationList sortedConversations={rejectedConv} />
        </TabsContent>
      </Tabs>
    </div>
  );
};




export default BoardInbox;
