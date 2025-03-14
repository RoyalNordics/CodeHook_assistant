import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Copy, Send } from "lucide-react";
import type { Message } from "@shared/schema";
import hljs from 'highlight.js';

interface CodeDisplayProps {
  messages: Message[];
  onSendToLangchain: (code: string) => void;
  isProcessing: boolean;
}

export function CodeDisplay({ messages, onSendToLangchain, isProcessing }: CodeDisplayProps) {
  const [currentCode, setCurrentCode] = useState<string>("");

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.hasCode) {
      const codeMatch = lastMessage.content.match(/```(?:\w+\n)?([\s\S]*?)```/);
      if (codeMatch) {
        const code = codeMatch[1].trim();
        setCurrentCode(code);
        
        // Apply syntax highlighting
        const highlighted = hljs.highlightAuto(code);
        const codeElement = document.getElementById('code-block');
        if (codeElement) {
          codeElement.innerHTML = highlighted.value;
          codeElement.className = 'hljs ' + highlighted.language;
        }
      }
    }
  }, [messages]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <h3 className="font-semibold">Generated Code</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            disabled={!currentCode}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => onSendToLangchain(currentCode)}
            disabled={!currentCode || isProcessing}
          >
            {isProcessing ? (
              <div className="animate-spin">⌛</div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] w-full rounded-md border p-4">
          <pre>
            <code id="code-block" className="text-sm">
              {currentCode || "No code generated yet"}
            </code>
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
