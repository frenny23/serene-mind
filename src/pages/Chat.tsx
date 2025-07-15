import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, ArrowUp, Info } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatMessage from "@/components/ChatMessage";
import { sendMessage } from "@/services/chatService";

interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    content:
      "Hi there! I'm Serene, your mental health assistant. How can I support you today?",
    isUser: false,
    timestamp: new Date(),
  },
];

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      content: input.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Convert messages to format expected by API
      const apiMessages = messages.concat(userMessage).map((msg) => ({
        role: msg.isUser ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

      const response = await sendMessage(apiMessages as any);

      const botMessage: Message = {
        content: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to get a response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container max-w-4xl py-8">
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg shadow-lg overflow-hidden h-[calc(100vh-12rem)]">
          <div className="bg-card p-4 border-b border-border flex justify-between items-center">
            <h1 className="text-lg font-medium">AI Mental Health Assistant</h1>
            <Button variant="ghost" size="icon">
              <Info size={18} />
            </Button>
          </div>

          <div className="p-4 h-[calc(100%-8rem)] overflow-y-auto bg-background/50">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message.content}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                <div
                  className="w-2 h-2 rounded-full bg-current animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-current animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex space-x-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here..."
                className="resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-primary text-white"
              >
                {isLoading ? (
                  <ArrowUp size={18} className="animate-bounce" />
                ) : (
                  <Send size={18} />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              This AI assistant is for educational purposes only. It is not a
              replacement for professional mental health care.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Chat;
