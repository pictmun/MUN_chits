import { Card, CardDescription, CardTitle } from "./ui/card";

export const NoMessage = () => {
  return (
    <Card className="mx-auto mt-[20vh] p-6 max-w-xl text-center shadow-none">
      <CardTitle className="text-2xl  mb-2">No messages found</CardTitle>
      <CardDescription className="text-sm text-muted-foreground">
        It looks like you haven’t received any messages yet. Once you do, they
        will appear here.
      </CardDescription>
    </Card>
  );
};
