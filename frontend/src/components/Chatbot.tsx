"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  CircleX,
  RefreshCcw,
  Send,
  User,
  AlertTriangle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MarkdownText } from "./markdown/mardown-text-new";

interface ChatMessages {
  role: "human" | "ai";
  content: string;
  isError?: boolean;
}

const initialMessage: ChatMessages = {
  role: "ai",
  content:
    "🌸 Welcome to PetalSoft! I'm **Petal**, your friendly AI assistant. How can I help you today? 💬 You can ask me about our products 🛍️ or check out our FAQ ❓ — and stay tuned, we're adding more features soon! 🚀",
};

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [loadingText, setLoadingText] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessages[]>([initialMessage]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const loadingSteps = [
    "Thinking...",
    "Processing request...",
    "Generating response...",
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages, loading, streaming, isOpen]);

  const startLoadingAnimation = () => {
    let stepIndex = 0;
    let animationIndex = 0;
    setLoadingText(loadingSteps[0]);

    loadingIntervalRef.current = setInterval(() => {
      if (stepIndex < loadingSteps.length - 1) {
        stepIndex++;
        setLoadingText(loadingSteps[stepIndex]);
      } else {
        const dots = ["●", "● ●", "● ● ●"];
        setLoadingText(
          `Generating response ${dots[animationIndex % dots.length]}`
        );
        animationIndex++;
      }
    }, 1200);
  };

  const sendMessage = async () => {
    if (!message.trim() || loading || streaming) return;

    const userMessage = message;
    const currentMessages = messages;

    setMessages((prev) => [...prev, { role: "human", content: userMessage }]);
    setMessage("");
    setLoading(true);
    startLoadingAnimation();

    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = "40px";
      setTimeout(() => textAreaRef.current?.focus(), 0);
    }

    const lastSixMessages = currentMessages.slice(-8);
    const historyString = lastSixMessages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    try {
      const response = await axios.post(`/api/chat`, {
        user_message: userMessage,
        history: historyString,
      });

      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
      setLoading(false);

      if (response.data && response.data.content) {
        setStreaming(true);
        const fullResponse = response.data.content;
        const words = fullResponse.split(/(\s+)/);

        setMessages((prev) => [...prev, { role: "ai", content: "" }]);

        let currentMessage = "";
        for (let i = 0; i < words.length; i++) {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.random() * 20 + 10)
          );

          currentMessage += words[i];

          setMessages((prev) => {
            const updatedMessages = [...prev];
            if (
              updatedMessages.length > 0 &&
              updatedMessages[updatedMessages.length - 1].role === "ai"
            ) {
              updatedMessages[updatedMessages.length - 1].content =
                currentMessage;
            }
            return updatedMessages;
          });
        }
        setStreaming(false);
      } else {
        console.error("Received unexpected response format:", response.data);
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            content: "Sorry, received an empty or invalid response.",
            isError: true,
          },
        ]);
        if (loadingIntervalRef.current)
          clearInterval(loadingIntervalRef.current);
        setLoading(false);
        setStreaming(false);
      }
    } catch (error) {
      console.error("API call error:", error);
      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
      setLoading(false);
      setStreaming(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Sorry, failed to get a response due to an error.",
          isError: true,
        },
      ]);
    } finally {
      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
    }
  };

  const startNewChat = () => {
    setMessages([initialMessage]);
    setMessage("");
    setLoading(false);
    setStreaming(false);
    if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
    if (textAreaRef.current) {
      setTimeout(() => textAreaRef.current?.focus(), 0);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-opacity duration-300 ease-in-out ${
                isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <Bot size={28} />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-foreground text-background">
            <p>Chat with AI Assistant</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-[calc(100%+1rem)] right-0 w-[90vw] max-w-[400px] h-[65vh] max-h-[600px] bg-background border rounded-lg shadow-xl flex flex-col overflow-hidden"
          >
            <div className="flex justify-between items-center p-3 border-b flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-foreground">
                  AI Assistant
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startNewChat}
                  className="text-xs h-7 px-2"
                  disabled={loading || streaming}
                >
                  <RefreshCcw size={14} className="mr-1" />
                  New Chat
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground h-7 w-7"
                >
                  <CircleX size={18} />
                  <span className="sr-only">Close chat</span>
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 overflow-y-auto bg-muted/20">
              <div className="p-4 space-y-4">
                {messages.length === 1 && messages[0] === initialMessage && (
                  <div className="flex items-start gap-3 pr-8">
                    <div className="p-1.5 bg-muted rounded-full mt-1 flex-shrink-0">
                      <Bot size={16} className="text-muted-foreground" />
                    </div>
                    <div className="max-w-[85%] p-3 rounded-lg text-sm bg-background border">
                      <MarkdownText>{initialMessage.content}</MarkdownText>
                    </div>
                  </div>
                )}

                {messages
                  .slice(messages[0] === initialMessage ? 1 : 0)
                  .map((msg, i) => {
                    const isError = msg.isError;
                    return (
                      <div
                        key={i}
                        className={`flex items-start gap-3 ${
                          msg.role === "human"
                            ? "justify-end pl-8"
                            : "justify-start pr-8"
                        }`}
                      >
                        {msg.role === "ai" && (
                          <div className="p-1.5 bg-muted rounded-full mt-1 flex-shrink-0">
                            <Bot size={16} className="text-muted-foreground" />
                          </div>
                        )}
                        <div
                          className={`max-w-[85%] p-3 rounded-lg text-sm break-words ${
                            msg.role === "human"
                              ? "bg-primary text-primary-foreground"
                              : isError
                                ? "bg-destructive/10 border border-destructive/30 text-destructive"
                                : "bg-background border"
                          }`}
                        >
                          {msg.isError && (
                            <AlertTriangle
                              size={16}
                              className="inline-block mr-2 text-destructive align-text-bottom"
                            />
                          )}
                          <MarkdownText>{msg.content}</MarkdownText>
                        </div>
                        {msg.role === "human" && (
                          <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-full mt-1 flex-shrink-0 order-last">
                            <User
                              size={16}
                              className="text-blue-700 dark:text-blue-300"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}

                {loading && (
                  <div className="flex items-start gap-3 pr-8">
                    <div className="p-1.5 bg-muted rounded-full mt-1 flex-shrink-0">
                      <Bot size={16} className="text-muted-foreground" />
                    </div>
                    <div className="max-w-[85%] p-3 bg-background border rounded-lg flex items-center gap-2 text-sm">
                      <span className="animate-pulse text-muted-foreground">
                        {loadingText || "..."}
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>

            <div className="p-3 border-t bg-background flex-shrink-0">
              <div className="flex items-end gap-2">
                <Textarea
                  ref={textAreaRef}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = `${Math.min(
                      e.target.scrollHeight,
                      100
                    )}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Ask me anything..."
                  className="flex-1 resize-none overflow-y-auto text-sm min-h-[40px] max-h-[100px] leading-tight focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
                  rows={1}
                  disabled={loading || streaming}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!message.trim() || loading || streaming}
                  size="icon"
                  className="h-10 w-10 flex-shrink-0"
                  aria-label="Send message"
                >
                  <Send size={18} />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatPopup;
