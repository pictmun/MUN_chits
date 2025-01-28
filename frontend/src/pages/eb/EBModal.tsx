import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loading } from "../../components/Loading";
import { NoMessage } from "../../components/NoMessage";
import { useFetchOneEbMessage } from "../../hooks/useFetchOneEbMessage";
import { EBMessage } from "../../components/EBMessage";
import { Button } from "../../components/ui/button";
import { XIcon } from "lucide-react";

const BoardModal = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchMessages, loading, message } = useFetchOneEbMessage();
  const navigate = useNavigate();
  useEffect(() => {
    if (id) fetchMessages(id);
  }, [id]);

  const handleClose = () => {
    navigate("/eb-board");
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
        <Button
          onClick={handleClose}
          className="size-8"
          variant={"outline"}
          size={"icon"}
        >
          <XIcon className="size-5" />
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {message.messages?.map((messge: any, index: number) => (
          <EBMessage key={index} message={messge} conversationId={message.conversationId} />
        ))}
      </div>
    </div>
  );
};

export default BoardModal;
