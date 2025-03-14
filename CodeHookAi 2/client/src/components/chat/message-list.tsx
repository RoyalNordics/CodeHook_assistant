import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Message } from "@shared/schema";
import { Bot, User } from "lucide-react";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  if (isLoading) {
    return (
      <div className="flex-1 p-4">
        <Skeleton className="h-20 mb-4" />
        <Skeleton className="h-20 mb-4" />
        <Skeleton className="h-20" />
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4">
      {messages.map((message) => (
        <Card key={message.id} className={`mb-4 p-4 ${
          message.role === 'user' ? 'bg-primary/10' : 'bg-secondary'
        }`}>
          <div className="flex items-start gap-3">
            {message.role === 'user' ? (
              <User className="h-6 w-6" />
            ) : (
              <Bot className="h-6 w-6" />
            )}
            <div className="flex-1">
              <div className="font-medium">
                {message.role === 'user' ? 'You' : 'Assistant'}
              </div>
              <div className="mt-1 whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        </Card>
      ))}
    </ScrollArea>
  );
}
