"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import axios from "axios";
import { Bot, CircleX, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { v4 as uuidv4 } from "uuid";

interface ChatMessages {
  role: "human" | "ai";
  content: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessages[]>([]);
  const [chatId, setChatId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const loadingSteps = [
    "🔍 Requesting information...",
    "📊 Analyzing data...",
    "🤖 Generating response...",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!chatId) {
      setTimeout(() => {
        setChatId(uuidv4());
      }, 1000);
    }
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { role: "human", content: message }]);
    setLoading(true);
    setLoadingText(loadingSteps[0]);

    if (!chatId) setChatId(uuidv4());

    let stepIndex = 0;
    let animationIndex = 0;
    let isBouncingDots = false;

    const interval = setInterval(() => {
      if (stepIndex < loadingSteps.length) {
        setLoadingText(loadingSteps[stepIndex]);
        stepIndex++;
      } else {
        // Cycle between bouncing dots when all steps are complete
        isBouncingDots = true;
        const dots = ["●", "● ●", "● ● ●"];
        setLoadingText(dots[animationIndex % dots.length]);
        animationIndex++;
      }
    }, 1000); // 1s per step

    try {
      await axios.post("/api/chat", { message, chat_session_id: chatId });

      const eventSource = new EventSource(
        `${BACKEND_URL}/chat_stream/${chatId}`
      );
      let botResponse = "";

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.content) {
            let index = 0;
            const words = data.content.split(" "); // Split by words for natural effect

            const streamText = () => {
              if (index < words.length) {
                setMessages((prev) => {
                  const last = prev[prev.length - 1];

                  if (last?.role === "ai") {
                    return [
                      ...prev.slice(0, -1),
                      {
                        role: "ai",
                        content: last.content + " " + words[index],
                      },
                    ];
                  }

                  return [...prev, { role: "ai", content: words[index] }];
                });

                index++;

                setTimeout(streamText, Math.random() * 20 + 20); // Random delay between 50-250ms
              }
            };

            streamText(); // Start streaming text
          }
        } catch (error) {
          console.error("Error parsing SSE data:", error);
        }
      };

      eventSource.addEventListener("end", () => {
        eventSource.close();
        clearInterval(interval);
        setLoading(false);
        setMessage("");
      });

      eventSource.onerror = (error) => {
        console.error("SSE error:", error);
        eventSource.close();
        clearInterval(interval);
        setLoading(false);
      };
    } catch (err) {
      console.error("Request failed:", err);
      clearInterval(interval);
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setChatId(uuidv4());
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
                  e.target.style.height = "auto"; // Reset height to recalculate
                  e.target.style.height =
                    Math.min(e.target.scrollHeight, 120) + "px"; // Max height ~3 rows
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
                style={{ minHeight: "40px", maxHeight: "120px" }} // Default height and max 3 rows
              />
              <Button
                onClick={sendMessage}
                disabled={loading}
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
