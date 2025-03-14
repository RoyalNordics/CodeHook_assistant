import { useState } from "react";
import { ProjectInfo } from "@/components/chat/project-info";
import { MessageList } from "@/components/chat/message-list";
import { MessageInput } from "@/components/chat/message-input";
import { CodeDisplay } from "@/components/chat/code-display";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Message, Project } from "@shared/schema";

export default function Chat() {
  const [projectId, setProjectId] = useState<number>(1);
  const { toast } = useToast();

  const { data: messages = [], isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: [`/api/messages/${projectId}`],
  });

  const { data: project } = useQuery<Project>({
    queryKey: [`/api/projects/${projectId}`],
  });

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/chat', {
        message,
        projectId,
        history: messages.map(m => ({ role: m.role, content: m.content }))
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/messages/${projectId}`] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message: " + error.message,
        variant: "destructive"
      });
    }
  });

  const langchainMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest('POST', '/api/langchain', { code, projectId });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.result
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to process code: " + error.message,
        variant: "destructive"
      });
    }
  });

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r">
        <ProjectInfo 
          project={project} 
          onProjectUpdate={() => {
            queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}`] });
          }}
        />
      </div>

      <div className="flex-1 flex flex-col">
        <MessageList 
          messages={messages} 
          isLoading={messagesLoading}
        />
        <MessageInput 
          onSend={(message) => chatMutation.mutate(message)}
          isLoading={chatMutation.isPending}
        />
      </div>

      <div className="w-1/4 border-l">
        <CodeDisplay 
          messages={messages}
          onSendToLangchain={(code) => langchainMutation.mutate(code)}
          isProcessing={langchainMutation.isPending}
        />
      </div>
    </div>
  );
}