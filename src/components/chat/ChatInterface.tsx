import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, User, Bot } from "lucide-react";
import { RpgButton } from "@/components/ui/rpg-button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome to the Mentor Chamber. I am GAMIFY IAS, your UPSC teacher and guide. Ask me anything about UPSC preparation — from concepts and strategies to answer writing and current affairs. Let us begin your journey.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const apiMessages = [...messages, userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const response = await supabase.functions.invoke("upsc-mentor", {
        body: { messages: apiMessages },
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to get response");
      }

      const data = response.data;
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content || "I apologize, but I could not process your request. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but there was an issue processing your request. Please try again shortly.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return <strong key={i} className="block font-display text-primary mt-3 mb-1">{line.slice(2, -2)}</strong>;
      }
      if (line.startsWith("- ")) {
        return <li key={i} className="ml-4 list-disc text-foreground/90">{line.slice(2)}</li>;
      }
      if (line.match(/^\d+\./)) {
        return <li key={i} className="ml-4 list-decimal text-foreground/90">{line.replace(/^\d+\./, "").trim()}</li>;
      }
      return <p key={i} className={line ? "mt-1" : "mt-3"}>{line}</p>;
    });
  };

  return (
    <div className="flex flex-col h-full bg-ambient">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-border bg-card/80 backdrop-blur-sm border-accent-line">
        <div className="flex items-center gap-3">
          {/* <div className="w-9 h-9 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div> */}
          <div>
            <h2 className="font-display text-xl text-foreground">AI Mentor</h2>
            <p className="text-xs text-muted-foreground font-body">UPSC AI Teacher & Guide</p>
            
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-premium p-6 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="flex-shrink-0 w-7 h-7 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center mt-1">
                  <Bot className="w-3.5 h-3.5 text-primary" />
                </div>
              )}
              
              <div
                className={cn(
                  "max-w-[75%] rounded-md px-4 py-3 font-body text-sm leading-relaxed",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border"
                )}
              >
                {message.role === "assistant" 
                  ? formatContent(message.content)
                  : message.content}
              </div>

              {message.role === "user" && (
                <div className="flex-shrink-0 w-7 h-7 rounded-md bg-secondary border border-border flex items-center justify-center mt-1">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 justify-start"
          >
            
            <div className="flex-shrink-0 w-7 h-7 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="bg-card border border-border rounded-md px-4 py-3">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-primary/60"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 px-6 py-4 border-t border-border bg-card/80 backdrop-blur-sm">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your UPSC question..."
              className="w-full resize-none rounded-md border border-border bg-input px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors duration-200"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <RpgButton
            variant="primary"
            size="icon"
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
          >
            <Send className="w-4 h-4" />
          </RpgButton>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 font-body text-center uppercase tracking-widest text-red-500">
          GAMIFY IAS responds only to UPSC-related queries. AI FOR JUST GAMIFY IAS STUDENTS.

        </p>
      </div>
    </div>
  );
}
