
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Message } from "../types";
import { formatDistanceToNow } from "date-fns";

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isCurrentUser }) => {
  return (
    <div
      className={cn(
        "flex",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      <Card
        className={cn(
          "max-w-[70%] shadow-sm",
          isCurrentUser
            ? "bg-business-primary text-white"
            : "bg-gray-100 text-gray-800"
        )}
      >
        <CardContent className="p-3">
          <p className="text-sm">{message.content}</p>
          <p
            className={cn(
              "text-xs mt-1",
              isCurrentUser ? "text-blue-100" : "text-gray-500"
            )}
          >
            {formatDistanceToNow(new Date(message.createdAt), {
              addSuffix: true,
            })}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageItem;
