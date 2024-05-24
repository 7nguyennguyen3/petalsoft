"use client";
import axios from "axios";
import { Bot, CircleX, Send, User } from "lucide-react";
import { RefObject, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import ReactMarkdown from "react-markdown";

const Chatbot = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [userMessage, setUserMessage] = useState("");
  const [sessionId, setSessionId] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const requestData = {
    question: userMessage,
    ...(sessionId && { overrideConfig: { sessionId } }),
  };

  const useOnClickOutside = (
    ref: RefObject<HTMLElement>,
    handler: (event: Event) => void
  ) => {
    useEffect(() => {
      const listener = (event: MouseEvent | TouchEvent) => {
        if (!ref.current || ref.current.contains(event.target as Node)) {
          return;
        }
        handler(event);
      };

      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);

      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    }, [ref, handler]);
  };

  const chatboxRef = useRef(null);
  useOnClickOutside(chatboxRef, () => setIsOpen(false));

  return (
    <div className="fixed bottom-5 right-5 w-full max-w-xl flex justify-end">
      <Button
        className="rounded-full self-end"
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <Bot size={24} />
      </Button>
      {isOpen && (
        <div
          ref={chatboxRef}
          className="absolute bottom-[120%] right-[45%] transform translate-x-1/2 
        w-[90%] max-w-[500px] h-[80vh] xs:max-h-[800px] sm:max-h-[700px] bg-zinc-400/90 rounded shadow flex flex-col xs:p-1 sm:p-3"
        >
          <div className="flex justify-between p-2">
            <Button
              variant="outline"
              onClick={() => {
                setMessages([]);
                setSessionId("");
              }}
              className="p-2 bg-transparent border-red-900 border-2 text-red-900"
            >
              Clear Chat
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIsOpen(false);
              }}
              className="p-2"
            >
              <CircleX size={30} />
            </Button>
          </div>
          <div className="flex-grow overflow-auto p-4">
            <div className="bg-white text-black rounded-lg p-5 my-2 max-w-max self-start relative">
              Hello! 🌸 I'm Petal, your beauty and fragrance guide. How can I
              assist you today?
              <Bot className="absolute bottom-[-10px] left-[-10px] text-[30px]" />
            </div>
            {messages.map((message, index) => {
              const isUserMessage = index % 2 === 0;
              return (
                <div
                  className={`${
                    isUserMessage
                      ? "bg-blue-600 text-white rounded-lg p-4 my-2 max-w-max ml-auto"
                      : "bg-white text-black rounded-lg p-4 my-2 max-w-max mr-auto"
                  } relative my-6`}
                  key={index}
                >
                  <ReactMarkdown>{message}</ReactMarkdown>
                  {isUserMessage ? (
                    <User className="absolute bottom-[-12px] right-[-12px]" />
                  ) : (
                    <Bot className="absolute bottom-[-10px] left-[-10px] text-[30px]" />
                  )}
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          <form
            className="p-3 flex items-center mt-auto"
            onSubmit={async (e) => {
              e.preventDefault();
              if (isLoading) return;
              setIsLoading(true);
              setUserMessage("");
              setTimeout(() => {
                setMessages((prev) => [
                  ...prev,
                  userMessage,
                  "Formulating a response...",
                ]);
              }, 500);
              try {
                const { data } = await axios.post("/api/chatbot", requestData);
                setSessionId(data.sessionId);
                setMessages((prev) => {
                  const filteredMessages = prev.filter(
                    (message) => message !== "Formulating a response..."
                  );
                  return [...filteredMessages, data.text];
                });
                console.log(data);
              } catch (error) {
                console.error(error);
              } finally {
                setIsLoading(false);
              }
            }}
          >
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              className="flex-grow mr-2 rounded-lg pl-2 pr-4 h-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button type="submit">
              <Send className="rotate-45" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
