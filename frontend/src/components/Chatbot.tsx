"use client";
import { useRef, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Bot, CircleX, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import remarkGfm from "remark-gfm";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

interface ChatMessages {
  role: "human" | "ai";
  content: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessages[]>([]);
  const [chatId, setChatId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setTimeout(() => {
      if (!chatId) {
        setChatId(uuidv4());
      }
    }, 1000);
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { role: "human", content: message }]);
    setLoading(true);

    if (!chatId) setChatId(uuidv4());

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
            botResponse += data.content;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last?.role === "ai") {
                return [
                  ...prev.slice(0, -1),
                  { role: "ai", content: last.content + data.content },
                ];
              }
              return [...prev, { role: "ai", content: data.content }];
            });
          }
        } catch (error) {
          console.error("Error parsing SSE data:", error);
        }
      };

      eventSource.addEventListener("end", () => {
        eventSource.close();
        setLoading(false);
        setMessage("");
      });

      eventSource.onerror = (error) => {
        console.error("SSE error:", error);
        eventSource.close();
        setLoading(false);
      };
    } catch (err) {
      console.error("Request failed:", err);
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setChatId(uuidv4());
  };

  return (
    <div className="fixed bottom-6 right-6 z-999">
      {/* Floating AI Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-all"
      >
        <Bot size={28} className="text-white" />
      </button>

      {/* Chat Container */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[90vw] max-w-[500px] min-h-[400px] h-[70vh] max-h-[800px] bg-white rounded-lg shadow-xl flex flex-col">
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
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <Button
                onClick={sendMessage}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
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
