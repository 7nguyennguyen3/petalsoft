"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import axios from "axios";
import { Bot, CircleX, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessages {
  role: "human" | "ai";
  content: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [loadingText, setLoadingText] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessages[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadingSteps = [
    "🔍 Requesting information...",
    "📊 Analyzing data...",
    "🤖 Generating response...",
  ];

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startLoadingAnimation = () => {
    let stepIndex = 0;
    let animationIndex = 0;

    loadingIntervalRef.current = setInterval(() => {
      if (stepIndex < loadingSteps.length) {
        setLoadingText(loadingSteps[stepIndex]);
        stepIndex++;
      } else {
        const dots = ["●", "● ●", "● ● ●"];
        setLoadingText(dots[animationIndex % dots.length]);
        animationIndex++;
      }
    }, 1000);
  };

  const sendMessage = async () => {
    if (!message.trim() || loading || streaming) return; // Disable if streaming

    // Add user message
    setMessages((prev) => [...prev, { role: "human", content: message }]);
    setLoading(true);
    startLoadingAnimation();

    try {
      const response = await axios.post(`/api/chat`, {
        user_message: message,
      });

      // Stop loading animation as soon as we start streaming
      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
      setLoading(false);
      setStreaming(true); // Enable streaming state

      // Simulate streaming effect
      const fullResponse = response.data.content;
      const words = fullResponse.split(" ");
      let currentMessage = "";

      for (let i = 0; i < words.length; i++) {
        // Add a small delay between words
        await new Promise((resolve) =>
          setTimeout(resolve, Math.random() * 20 + 20)
        );

        currentMessage += (i > 0 ? " " : "") + words[i];

        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "ai") {
            return [
              ...prev.slice(0, -1),
              { role: "ai", content: currentMessage },
            ];
          }
          return [...prev, { role: "ai", content: currentMessage }];
        });
      }
    } catch (err) {
      console.error("Message send failed:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Sorry, there was an error processing your request",
        },
      ]);
    } finally {
      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
      setLoading(false);
      setStreaming(false); // Disable streaming state
      setMessage("");
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setMessage("");
    setLoading(false);
    setStreaming(false); // Reset streaming state
    if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
  };

  return (
    <div className="fixed bottom-4 right-5 z-999">
      {/* Floating AI Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-all"
      >
        <Bot size={28} className="text-white" />
      </button>

      {/* Chat Container */}
      {isOpen && (
        <div className="absolute bottom-0 right-0 w-[90vw] max-w-[500px] min-h-[300px] h-[75vh] sm:h-[80vh] max-h-[800px] bg-white rounded-lg shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMessages([])}
                className="text-red-600 border-red-600"
              >
                Clear
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={startNewChat}
                className="text-blue-600 border-blue-600"
              >
                New Chat
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <CircleX size={20} />
            </Button>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-4 ${
                  msg.role === "human" ? "ml-auto" : "mr-auto"
                } max-w-[80%]`}
              >
                <div
                  className={`p-3 rounded-lg ${
                    msg.role === "human"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {/* Loading Animation */}
            {loading && (
              <div className="mr-auto max-w-[80%]">
                <div className="p-3 bg-gray-100 rounded-lg animate-pulse">
                  {loadingText}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex-col flex 400:flex-row items-center gap-2">
              <textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height =
                    Math.min(e.target.scrollHeight, 120) + "px";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type your message..."
                className="flex-1 p-2 border w-full max-w-4/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
                disabled={loading}
                style={{ minHeight: "40px", maxHeight: "120px" }}
              />
              <Button
                onClick={sendMessage}
                disabled={loading || streaming}
                className="bg-blue-600 hover:bg-blue-700 h-12 w-12 rounded-full"
              >
                <Send size={18} className="rotate-45" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPopup;
